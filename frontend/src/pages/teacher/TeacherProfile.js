import React from 'react'
import styled from 'styled-components';
import { Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  // Ajouter des vérifications pour éviter les erreurs si currentUser n'est pas encore chargé
  const teachSclass = currentUser?.teachSclass || {}
  const teachSubject = currentUser?.teachSubject || {}
  const teachSchool = currentUser?.school || {}

  return (
    <>
      <ProfileCard>
        <ProfileCardContent>
          <ProfileText>Name: {currentUser?.name || 'Non disponible'}</ProfileText>
          <ProfileText>Email: {currentUser?.email || 'Non disponible'}</ProfileText>
          <ProfileText>Class: {teachSclass?.sclassName || 'Non disponible'}</ProfileText>
          <ProfileText>Subject: {teachSubject?.subName || 'Non disponible'}</ProfileText>
          <ProfileText>School: {teachSchool?.schoolName || 'Non disponible'}</ProfileText>
        </ProfileCardContent>
      </ProfileCard>
    </>
  )
}

export default TeacherProfile

const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileText = styled(Typography)`
  margin: 10px;
`;