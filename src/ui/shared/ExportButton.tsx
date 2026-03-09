export function ExportButton(props: { label?: string }) {
  return (
    <button
      className="btn btnPrimary noPrint"
      onClick={() => {
        window.print();
      }}
    >
      {props.label ?? "Exportar a PDF"}
    </button>
  );
}

