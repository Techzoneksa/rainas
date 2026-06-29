import type { PostPoint } from "@raina/api-contracts";

interface ProsConsSectionProps {
  pros: PostPoint[] | undefined;
  cons: PostPoint[] | undefined;
}

export function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  return (
    <div className="web-pros-cons">
      <div className="web-pros-cons__card web-pros-cons__card--pros">
        <div className="web-pros-cons__icon pros" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 13l3 3 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="web-pros-cons__title">الإيجابيات</h3>
        {pros && pros.length > 0 ? (
          <ul className="web-pros-cons__list">
            {pros.map((point) => (
              <li key={point.id}>{point.body}</li>
            ))}
          </ul>
        ) : (
          <p className="web-pros-cons__empty">لم يذكر المستخدم إيجابيات محددة.</p>
        )}
      </div>
      <div className="web-pros-cons__card web-pros-cons__card--cons">
        <div className="web-pros-cons__icon cons" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 8l-10 10M7 8l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className="web-pros-cons__title">الملاحظات</h3>
        {cons && cons.length > 0 ? (
          <ul className="web-pros-cons__list">
            {cons.map((point) => (
              <li key={point.id}>{point.body}</li>
            ))}
          </ul>
        ) : (
          <p className="web-pros-cons__empty">لم يذكر المستخدم ملاحظات محددة.</p>
        )}
      </div>
    </div>
  );
}
