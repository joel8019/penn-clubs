import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'

import { Container, Metadata, Title } from '../components/common'
import AuthPrompt from '../components/common/AuthPrompt'
import ClubTab from '../components/Settings/ClubTab'
import FavoritesTab from '../components/Settings/FavoritesTab'
import MembershipRequestsTab from '../components/Settings/MembershipRequestsTab'
import ProfileTab from '../components/Settings/ProfileTab'
import TabView from '../components/TabView'
import { BG_GRADIENT, CLUBS_BLUE, WHITE } from '../constants/colors'
import { BORDER_RADIUS } from '../constants/measurements'
import renderPage from '../renderPage'
import { UserInfo } from '../types'
import { OBJECT_NAME_TITLE } from '../utils/branding'

const Notification = styled.span`
  border-radius: ${BORDER_RADIUS};
  background-color: ${CLUBS_BLUE};
  color: ${WHITE};
  font-size: 16px;
  padding: 5px 10px;
  overflow-wrap: break-word;
  position: absolute;
  right: 2rem;
  margin-top: 2rem;
  padding-right: 35px;
  max-width: 50%;
`

type SettingsProps = {
  userInfo: UserInfo
  authenticated: boolean | null
}

const Settings = ({ userInfo, authenticated }: SettingsProps) => {
  const [message, setMessage] = useState<ReactNode>(null)

  /**
   * Display the message and scroll the user to the top of the page.
   * @param The message to show to the user.
   */
  const notify = (msg: ReactNode): void => {
    setMessage(msg)
    window.scrollTo(0, 0)
  }

  if (authenticated === null) {
    return <div></div>
  }

  if (!userInfo) {
    return <AuthPrompt />
  }

  const tabs = [
    {
      name: OBJECT_NAME_TITLE,
      icon: 'peoplelogo',
      content: <ClubTab notify={notify} userInfo={userInfo} />,
    },
    {
      name: 'Bookmarks',
      icon: 'heart',
      content: <FavoritesTab key="bookmark" keyword="bookmark" />,
    },
    {
      name: 'Subscriptions',
      icon: 'bookmark',
      content: <FavoritesTab key="subscription" keyword="subscription" />,
    },
    {
      name: 'Requests',
      icon: 'user-check',
      content: <MembershipRequestsTab />,
    },
    {
      name: 'Profile',
      icon: 'user',
      content: <ProfileTab defaults={userInfo} />,
    },
  ]

  return (
    <>
      <Metadata title="Your Profile" />
      <Container background={BG_GRADIENT}>
        <Title style={{ marginTop: '2.5rem', color: WHITE, opacity: 0.95 }}>
          Welcome, {userInfo.name}
        </Title>
      </Container>
      <TabView background={BG_GRADIENT} tabs={tabs} tabClassName="is-boxed" />

      {message != null && (
        <Container>
          <Notification className="notification">
            <button className="delete" onClick={() => setMessage(null)} />
            {message}
          </Notification>
        </Container>
      )}
    </>
  )
}

export default renderPage(Settings)
