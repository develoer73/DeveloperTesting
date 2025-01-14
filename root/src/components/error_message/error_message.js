export class ErrorMessage {
    static instance = null;
    static TEMPLATE_PATH = '../../components/error_message/error_message.html';
    static CSS_PATH = '../../components/error_message/error_message.css';

    static getInstance() {
        if (!ErrorMessage.instance) {
            ErrorMessage.instance = new ErrorMessage();
        }
        return ErrorMessage.instance;
    }

    constructor() {
        this.modalInstance = null;
        this.loadDependencies();
    }

    async loadDependencies() {
        await this.loadCSS();
        await this.loadTemplate();
    }

    loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = ErrorMessage.CSS_PATH;
        document.head.appendChild(link);
    }

    async loadTemplate() {
        try {
            const response = await fetch(ErrorMessage.TEMPLATE_PATH);
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
        } catch (error) {
            console.error('Failed to load error modal template:', error);
        }
    }

    static async show(message, title = 'Error') {
        const instance = ErrorMessage.getInstance();
        
        if (!bootstrap) {
            console.error('Bootstrap is not loaded');
            alert(message);
            return;
        }

        const modalElement = document.getElementById('globalErrorModal');
        if (!modalElement) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!instance.modalInstance && modalElement) {
            instance.modalInstance = new bootstrap.Modal(modalElement);
        }

        if (instance.modalInstance) {
            document.getElementById('globalErrorModalLabel').textContent = title;
            document.getElementById('globalModalErrorMessage').textContent = message;
            instance.modalInstance.show();
        }
    }

    static hide() {
        ErrorMessage.instance?.modalInstance?.hide();
    }
}
