import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import supabase from '../utils/supabase/client'; // Adjust the path as per your project structure
import Header from '../components/Header';
import Footer from '../components/Footer';

const AccountCenter = () => {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fullName, setFullName] = useState(''); // State to store the user's name

  useEffect(() => {
    if (!user) {
      router.push('/signin'); // Redirect to sign-in if the user is not logged in
    } else {
      fetchUserName(); // Fetch the user's name from the profiles table
    }
  }, [user, router]);

  const fetchUserName = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles') // Query the profiles table
        .select('full_name') // Select the full_name column
        .eq('id', user.id) // Match the user's ID
        .single(); // Expect a single result

      if (error) {
        console.error('Error fetching user name:', error.message);
        setFullName('N/A'); // Fallback if there's an error
      } else {
        setFullName(data.full_name || 'N/A'); // Set the fetched name
      }
    } catch (error) {
      console.error('Unexpected error fetching user name:', error.message);
      setFullName('N/A');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validate old password by re-authenticating the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) {
        setErrorMessage('Old password is incorrect.');
        setLoading(false);
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setErrorMessage('Failed to update password. Please try again.');
        setLoading(false);
        return;
      }

      setSuccessMessage('Your password has been successfully updated.');
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#fff5e6] flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#b22222] mb-6">Account Center</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-[#b22222]">Name</p>
              <p className="text-lg font-medium">{fullName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#b22222]">Email</p>
              <p className="text-lg font-medium">{user?.email || 'N/A'}</p>
            </div>
          </div>
          <hr className="my-6 border-[#b22222]" />
          <h3 className="text-lg font-semibold text-[#b22222] mb-4">Change Password</h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your old password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your new password"
                required
              />
            </div>
            {successMessage && <p className="success-text">{successMessage}</p>}
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 10px;
          border: 2px solid #b22222;
          border-radius: 8px;
          background-color: #f3e5ab;
          color: #b22222;
          transition: all 0.3s;
        }
        .input-field:focus {
          border-color: #8b0000;
          box-shadow: 0px 0px 8px rgba(178, 34, 34, 0.5);
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background-color: #b22222;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .submit-btn:hover {
          background-color: #8b0000;
        }
        .submit-btn:disabled {
          background-color: #d3d3d3;
          cursor: not-allowed;
        }
        .success-text {
          color: green;
          font-size: 14px;
        }
        .error-text {
          color: red;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default AccountCenter;