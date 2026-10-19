import React from "react";

export function WhatsAppButton() {
  return (
    <a
      href="https://api.whatsapp.com/send/?phone=919816931822&text=How+can+i+help+you%3F&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp-btn"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        backgroundColor: "#25D366",
        color: "#ffffff",
        borderRadius: "50%",
        width: 52,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 14px rgba(37, 211, 102, 0.4)",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      aria-label="Chat on WhatsApp"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.91.536 3.696 1.467 5.22L2 22l4.908-1.428A9.94 9.94 0 0 0 12.004 22c5.518 0 10.004-4.486 10.004-9.996C22.008 6.486 17.522 2 12.004 2zm5.727 14.184c-.24.672-1.39 1.284-1.92 1.344-.492.06-1.128.084-3.648-.96-3.216-1.332-5.268-4.596-5.424-4.812-.156-.204-1.284-1.716-1.284-3.264 0-1.548.804-2.316 1.092-2.628.288-.312.636-.384.852-.384.216 0 .432.002.624.012.204.012.48-.076.744.564.276.672.936 2.292 1.02 2.46.084.168.144.372.024.588-.108.204-.168.324-.336.528-.168.204-.348.456-.504.612-.168.168-.348.348-.156.672.192.324.852 1.404 1.836 2.28 1.26 1.128 2.328 1.476 2.652 1.644.324.168.516.144.708-.072.192-.216.828-.96 1.044-1.296.216-.336.444-.276.744-.168.3.108 1.92.912 2.256 1.08.336.168.552.252.636.396.084.144.084.828-.156 1.5z" />
      </svg>
    </a>
  );
}
