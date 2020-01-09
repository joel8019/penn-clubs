import { useState } from 'react'
import Link from 'next/link'
import s from 'styled-components'
import { ALLBIRDS_GRAY, SNOW } from '../../constants/colors'

import { TagGroup, InactiveTag, Title, BookmarkIcon, SubscribeIcon } from '../common'
import { ROLE_OFFICER } from '../../utils'

const Wrapper = s.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`

const BookmarkWrapper = s.span`
  display: inline-block;
  vertical-align: middle;

`

const ActionWrapper = s.span`
    display: inline-block;
    background-color: #EAEAEA;
    border-radius: 30px;
    border: 1px solid #EAEAEA;
    padding-left: 1rem;
    padding-right: 1rem;

`

const ActionDiv = s.span`
    display: inline-block;
    color: #4a4a4a;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
`

const Header = ({
  club,
  userInfo,
  favorites,
  style,
  updateFavorites,
  subscriptions,
  updateSubscriptions,
}) => {
  const isFavorite = favorites.includes(club.code)
  const isSubscription = subscriptions.includes(club.code)

  // inClub is set to the membership object if the user is in the club, or false
  // otherwise
  const inClub =
    userInfo &&
    (userInfo.membership_set.filter(a => a.id === club.code) || [false])[0]

  // a user can edit a club if they are either a superuser or in the club and
  // at least an officer
  const canEdit =
    (inClub && inClub.role <= ROLE_OFFICER) ||
    (userInfo && userInfo.is_superuser)

  const [favCount, setFavCount] = useState(club.favorite_count || 0)

  const { active, code, name, tags, badges } = club

  return (
    <div style={style}>
      <Wrapper>
        <Title style={{ marginBottom: '0.25rem' }}>
          {name}
          {!active && <InactiveTag />}
        </Title>
        <span>
            <ActionWrapper>
              <BookmarkWrapper>
                <BookmarkIcon
                  club={club}
                  favorite={isFavorite}
                  updateFavorites={(id) => {
                    const upd = updateFavorites(id)
                    setFavCount(favCount + (upd ? 1 : -1))
                  }}
                  padding="0"
                />
                {' '}{favCount}
              </BookmarkWrapper>
              <ActionDiv>|</ActionDiv>
              <SubscribeIcon
                club={club}
                subscribe={isSubscription}
                updateSubscribes={updateSubscriptions}
              />
            </ActionWrapper>
          {canEdit && (
            <Link href="/club/[club]/edit" as={`/club/${code}/edit`}>
              <a className="button is-success" style={{ marginLeft: 15 }}>
                Edit Club
              </a>
            </Link>
          )}
        </span>
      </Wrapper>
      <div style={{ marginBottom: '1rem' }}>
        <TagGroup tags={tags} />
        <TagGroup tags={badges} />
      </div>
    </div>
  )
}

export default Header
