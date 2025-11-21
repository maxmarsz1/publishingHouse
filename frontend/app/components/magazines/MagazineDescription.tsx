import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { updatePublisher } from '@/app/utils/publisher-helper-client';
import { UserContext } from '@/app/context/UserContext';

const MagazineDescription = ({
  publisherDescription,
  publisherId
}: {
  publisherDescription: string | undefined;
  publisherId: number;
}) => {
  const { isStaff } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(publisherDescription || '');
  const [descriptionInput, setDescriptionInput] = useState(publisherDescription || '');

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescriptionInput(event.target.value);
  };

  const handleSave = async () => {
    try {
      await updatePublisher({ id: publisherId, description: descriptionInput });
      setDescription(descriptionInput);
      setIsEditing(false);
      console.log('Updated description:', descriptionInput);
    } catch (error) {
      console.error('Error updating publisher description:', error);
    }
  };

  const handleCancel = () => {
    setDescriptionInput(description);
    setIsEditing(false);
  };

  if (!isStaff) {
    return (
      <div>
        <p style={{ whiteSpace: 'pre-wrap', marginBottom: '32px' }}>{description || 'Brak opisu'}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {isEditing ? (
        <>
          <TextField
            value={descriptionInput}
            onChange={handleDescriptionChange}
            multiline
            rows={3}
            fullWidth
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Zapisz
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Anuluj
            </Button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p
            style={{whiteSpace: 'pre-wrap' }}
          >
            {description || 'Brak opisu'}
          </p>
          <FontAwesomeIcon
            icon={faPencilAlt}
            style={{ cursor: 'pointer' }}
            onClick={() => setIsEditing(true)}
          />
        </div>
      )}
    </div>
  );
};

export default MagazineDescription;