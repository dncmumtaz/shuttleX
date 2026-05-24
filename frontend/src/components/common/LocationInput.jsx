import { LOCATIONS } from '../../utils/tripUtils';

export default function LocationInput({ id, label, name, value, onChange, error, placeholder }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>
      <input
        id={id}
        name={name}
        list={`${id}-list`}
        type="text"
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      <datalist id={`${id}-list`}>
        {LOCATIONS.map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
