class Store {
    constructor() {
        this.state = {
            user: null,
            isLoading: false,
            error: null
        };
        this.listeners = new Set();
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        try {
            this.state = { ...this.state, ...newState };
            this.notify();
        } catch (error) {
            console.error('Store setState error:', error);
        }
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Helper methods for common state updates
    setLoading(isLoading) {
        this.setState({ isLoading });
    }

    setError(error) {
        this.setState({ error });
    }

    clearError() {
        this.setState({ error: null });
    }
}

// Export a single store instance
export const store = new Store();
