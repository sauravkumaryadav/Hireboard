// Reusable Input component with label
export default function Input({ label, ...props }) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...props} />
    </div>
  );
}
