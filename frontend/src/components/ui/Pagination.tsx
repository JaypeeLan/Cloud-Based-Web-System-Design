type Props = {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, total, onPageChange }: Props) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="row between pagination">
      <span className="muted-text">
        Page {page} of {totalPages} · {total} total
      </span>
      <div className="row">
        <button className="ghost-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button className="ghost-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};
