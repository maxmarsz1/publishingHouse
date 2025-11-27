export async function updateUserContext(setIsStaff:(value: boolean) => void){
    const decodeResponse = await fetch('/api/auth/decode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      
        if (decodeResponse.ok) {
          const { isStaff } = await decodeResponse.json();
          setIsStaff(isStaff);
        } else {
          console.error('Failed to decode access token:', await decodeResponse.json());
        }
}