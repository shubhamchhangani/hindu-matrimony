import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import supabase from '../utils/supabase/client';
import { addMessage } from '../slices/chatsSlice';

function useChatSubscription() {
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = supabase
      .from('chats')
      .on('INSERT', (payload) => {
        // When a new chat message is inserted, dispatch an action to add it to the state
        dispatch(addMessage(payload.new));
      })
      .subscribe();

    return () => supabase.removeSubscription(subscription);
  }, [dispatch]);
}

export default useChatSubscription;
