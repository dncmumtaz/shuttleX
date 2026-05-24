import { useTranslation } from 'react-i18next';

const STEPS = [
  { id: 1, key: 'stepSearch' },
  { id: 2, key: 'stepVehicle' },
  { id: 3, key: 'stepInfo' },
  { id: 4, key: 'stepSummaryConfirm' },
];

export default function BookingStepper({ currentStep }) {
  const { t } = useTranslation();

  return (
    <div className="booking-stepper booking-stepper-4">
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="booking-stepper-item">
            <div className="booking-stepper-track">
              <div
                className={`booking-stepper-circle ${
                  isCompleted ? 'completed' : isActive ? 'active' : ''
                }`}
              >
                {isCompleted ? '✓' : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`booking-stepper-line ${isCompleted ? 'completed' : ''}`} />
              )}
            </div>
            <span className={`booking-stepper-label ${isActive ? 'active' : ''}`}>
              {t(`booking.${step.key}`)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
