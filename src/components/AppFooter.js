import React from 'react'
import { CFooter } from '@coreui/react-pro'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://simpeg.ar-raniry.ac.id" target="_blank" rel="noopener noreferrer">
          Simpeg
        </a>
        <span className="ms-1">&copy; 2025 UIN Ar-Raniry Banda Aceh.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a
          href="https://ict.uin.ar-raniry.ac.id/index.php/id"
          target="_blank"
          rel="noopener noreferrer"
        >
          PTIPD UIN Ar-Raniry Banda Aceh
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
