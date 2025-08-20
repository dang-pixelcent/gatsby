import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // Bạn có thể log lỗi ở đây nếu muốn
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return null; // hoặc trả về UI fallback khác
        }
        return this.props.children;
    }
}

export default ErrorBoundary;