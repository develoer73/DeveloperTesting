

// Simple store implementation
const store = {
    setLoading: (loading) => console.log('Loading:', loading),
    setError: (error) => console.error('Error:', error),
    setState: (state) => console.log('State updated:', state)
};

class AuthService {
    async signIn(email, password) {
        try {
            store.setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            store.setState({ user: data.user });
            return data;
        } catch (error) {
            store.setError(error.message);
            throw error;
        } finally {
            store.setLoading(false);
        }
    }

    async signOut() {
        try {
            store.setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            store.setState({ user: null });
        } catch (error) {
            store.setError(error.message);
            throw error;
        } finally {
            store.setLoading(false);
        }
    }

    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    async resetPassword(email) {
        try {
            store.setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
        } catch (error) {
            store.setError(error.message);
            throw error;
        } finally {
            store.setLoading(false);
        }
    }

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
}

export const authService = new AuthService();
