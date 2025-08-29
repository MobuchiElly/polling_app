import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';

export const useUserClient = () => {
    const { user } = useAuth();

    const fetchPolls = async () => {
        if (!user) throw new Error('User not logged in');
        const { data, error } = await supabase
            .from('polls')
            .select('*')
            .eq('created_by', user.id);
        return { data, error };
    };

    return { user, fetchPolls };
};