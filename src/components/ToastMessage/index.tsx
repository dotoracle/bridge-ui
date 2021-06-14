function ToastIcon({ type }: { type: 'success' | 'danger' | 'info' }): JSX.Element {
  let html = <></>

  switch (type) {
    case 'success':
      html = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )
      break
    case 'danger':
      html = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      )
      break
    case 'info':
    default:
      html = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
      break
  }

  return html
}

interface IToastMessageProps {
  color: 'success' | 'danger' | 'info'
  headerText: string
  bodyText?: string
  link?: string
  linkText?: string
}

function ToastMessage(props: IToastMessageProps): JSX.Element {
  const { color, headerText, bodyText, link, linkText } = props

  return (
    <>
      <div className="toastify-header">
        <div className="title-wrapper">
          <div className="toastify-icon">
            <ToastIcon type={color} />
          </div>
          <h6 className="toastify-title">{headerText}</h6>
        </div>
      </div>
      {bodyText && (
        <div className="toastify-body">
          <span>{bodyText}</span>
        </div>
      )}
      {link && (
        <a className="toastify-link" target="_blank" href={link}>
          {linkText ? linkText : 'See more'}
        </a>
      )}
    </>
  )
}

export default ToastMessage
