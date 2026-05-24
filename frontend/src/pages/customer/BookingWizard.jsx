import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { createTravelRequest, searchAvailableDrivers, selectDriver } from '../../api/travelRequestApi';
import { extractApiErrorMessage } from '../../api/axiosInstance';
import BookingTopBar from '../../components/booking/BookingTopBar';
import ReservationSummarySidebar from '../../components/booking/ReservationSummarySidebar';
import SearchTripStep from '../../components/booking/SearchTripStep';
import VehicleSelectionStep from '../../components/booking/VehicleSelectionStep';
import PassengerInfoStep from '../../components/booking/PassengerInfoStep';
import SummaryStep from '../../components/booking/SummaryStep';
import {
  buildReservationNotes,
  calculateTotal,
  initialBookingState,
  validateContactForm,
} from '../../utils/bookingUtils';
import { resolveBookingExtras } from '../../utils/vehicleServiceCatalog';
import '../../styles/booking.css';

export default function BookingWizard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState(initialBookingState);
  const [searchErrors, setSearchErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});

  useEffect(() => {
    if (user) {
      setState((prev) => ({
        ...prev,
        contact: {
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          phone: prev.contact.phone,
          email: user.email || '',
        },
        passengers: [{ name: `${user.firstName || ''} ${user.lastName || ''}`.trim() }],
      }));
    }
  }, [user]);

  const availableExtras = useMemo(() => {
    if (!state.selectedDriver?.services) return [];
    return resolveBookingExtras(state.selectedDriver.services);
  }, [state.selectedDriver]);

  const total = useMemo(
    () =>
      calculateTotal({
        extraServices: state.extraServices,
        returnTransfer: state.returnTransfer,
        driverServices: state.selectedDriver?.services || [],
      }),
    [state.extraServices, state.returnTransfer, state.selectedDriver]
  );

  const handleSearchChange = (search) => {
    setState((prev) => ({ ...prev, search }));
    setSearchErrors({});
  };

  const handleSearch = async (validationErrors) => {
    if (Object.keys(validationErrors).length > 0) {
      setSearchErrors(validationErrors);
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null, drivers: [] }));

    try {
      const passengerCount = state.search.passengerCount;
      const foundDrivers = await searchAvailableDrivers({
        origin: state.search.origin.trim(),
        destination: state.search.destination.trim(),
        departureDateTime: state.search.departureDateTime,
        passengerCount,
      });

      setState((prev) => ({
        ...prev,
        drivers: foundDrivers,
        searched: true,
        loading: false,
        step: 2,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: extractApiErrorMessage(err, t('booking.noVehicles')),
      }));
    }
  };

  const handleSelectDriver = (driver) => {
    const availableKeys = resolveBookingExtras(driver.services || []).map((service) => service.id);

    setState((prev) => ({
      ...prev,
      selectedDriver: driver,
      extraServices: prev.extraServices.filter((id) => availableKeys.includes(id)),
      step: 3,
      error: null,
    }));
  };

  const handleToggleExtra = (serviceId) => {
    setState((prev) => ({
      ...prev,
      extraServices: prev.extraServices.includes(serviceId)
        ? prev.extraServices.filter((id) => id !== serviceId)
        : [...prev.extraServices, serviceId],
    }));
  };

  const handleComplete = async () => {
    const errors = validateContactForm(state.contact);
    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactErrors({});
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const passengerCount = state.search.passengerCount;
      const notes = buildReservationNotes({
        passengers: state.passengers,
        flight: state.flight,
        returnTransfer: state.returnTransfer,
        extraServices: state.extraServices,
        specialNote: state.specialNote,
        searchNotes: state.search.notes,
        contact: state.contact,
      });

      const createdRequest = await createTravelRequest({
        origin: state.search.origin.trim(),
        destination: state.search.destination.trim(),
        departureDateTime: state.search.departureDateTime,
        passengerCount,
        notes: notes || undefined,
      });

      const selection = await selectDriver(createdRequest.id, state.selectedDriver.driverProfileId);

      setState((prev) => ({
        ...prev,
        loading: false,
        step: 4,
        travelRequestId: createdRequest.id,
        confirmation: {
          reservationNo: createdRequest.id,
          bookingId: selection.bookingId,
          bookingStatus: selection.bookingStatus,
          travelRequestStatus: selection.travelRequestStatus,
          search: prev.search,
          selectedDriver: prev.selectedDriver,
          contact: prev.contact,
          flight: prev.flight,
          returnTransfer: prev.returnTransfer,
          extraServices: prev.extraServices,
          total,
          createdAt: selection.createdAt || new Date().toISOString(),
        },
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: extractApiErrorMessage(err, t('booking.processing')),
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="booking-wizard">
      <BookingTopBar currentStep={state.step} />

      {state.error && <div className="booking-alert mb-3 mx-3">{state.error}</div>}

      <div className="booking-layout">
        <div className="booking-main">
          {state.step === 1 && (
            <SearchTripStep
              search={state.search}
              errors={searchErrors}
              loading={state.loading}
              onSearchChange={handleSearchChange}
              onSearch={handleSearch}
            />
          )}

          {state.step === 2 && (
            <VehicleSelectionStep
              search={state.search}
              drivers={state.drivers}
              loading={state.loading}
              onSelectDriver={handleSelectDriver}
              onBack={() => setState((prev) => ({ ...prev, step: 1 }))}
            />
          )}

          {state.step === 3 && (
            <PassengerInfoStep
              contact={state.contact}
              contactErrors={contactErrors}
              passengers={state.passengers}
              flight={state.flight}
              returnTransfer={state.returnTransfer}
              extraServices={state.extraServices}
              availableExtras={availableExtras}
              specialNote={state.specialNote}
              total={total}
              loading={state.loading}
              onContactChange={(contact) => setState((prev) => ({ ...prev, contact }))}
              onPassengersChange={(passengers) => setState((prev) => ({ ...prev, passengers }))}
              onFlightChange={(flight) => setState((prev) => ({ ...prev, flight }))}
              onReturnTransferChange={(returnTransfer) =>
                setState((prev) => ({ ...prev, returnTransfer }))
              }
              onToggleExtra={handleToggleExtra}
              onSpecialNoteChange={(specialNote) => setState((prev) => ({ ...prev, specialNote }))}
              onBack={() => setState((prev) => ({ ...prev, step: 2 }))}
              onSubmit={handleComplete}
            />
          )}

          {state.step === 4 && (
            <>
              <SummaryStep confirmation={state.confirmation} onPrint={handlePrint} />
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-booking-outline"
                  onClick={() => navigate('/customer/trips')}
                >
                  {t('common.myTrips')} →
                </button>
              </div>
            </>
          )}
        </div>

        {state.step < 4 && (
          <ReservationSummarySidebar
            search={state.search}
            selectedDriver={state.selectedDriver}
            total={state.step >= 3 ? total : null}
            showSelectedVehicle={state.step >= 2 && Boolean(state.selectedDriver)}
          />
        )}
      </div>
    </div>
  );
}
