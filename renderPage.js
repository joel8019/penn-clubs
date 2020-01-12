import React from 'react'
import s from 'styled-components'

import Header from './components/Header'
import Footer from './components/Footer'
import { Loading } from './components/common'

import { WHITE } from './constants/colors'
import { doApiRequest } from './utils'
import { logEvent } from './utils/analytics'
import { logException } from './utils/sentry'
import { NAV_HEIGHT } from './constants/measurements'
import { BODY_FONT } from './constants/styles'

const Wrapper = s.div`
  min-height: calc(100vh - ${NAV_HEIGHT});
  font-family: ${BODY_FONT};
`

function renderPage(Page) {
  class RenderPage extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        authenticated: null,
        userInfo: null,
        favorites: [],
        subscriptions: [],
      }

      this.updateFavorites = this.updateFavorites.bind(this)
      this.updateSubscriptions = this.updateSubscriptions.bind(this)
      this.updateUserInfo = this.updateUserInfo.bind(this)
    }

    componentDidMount() {
      this.updateUserInfo()
    }

    render() {
      try {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: WHITE,
            }}
          >
            <Header
              authenticated={this.state.authenticated}
              userInfo={this.state.userInfo}
            />
            <Wrapper>
              <Page
                {...this.props}
                {...this.state}
                updateFavorites={this.updateFavorites}
                updateSubscriptions={this.updateSubscriptions}
                updateUserInfo={this.updateUserInfo}
              />
            </Wrapper>
            <Footer />
          </div>
        )
      } catch (ex) {
        logException(ex)
      }
    }

    updateFavorites(id) {
      if (this.state.authenticated) {
        const { favorites: newFavs } = this.state
        const i = newFavs.indexOf(id)
        if (i === -1) {
          newFavs.push(id)
          logEvent('favorite', id)
          doApiRequest('/favorites/?format=json', {
            method: 'POST',
            body: { club: id },
          })
        } else {
          newFavs.splice(i, 1)
          logEvent('unfavorite', id)
          doApiRequest(`/favorites/${id}/?format=json`, {
            method: 'DELETE',
          })
        }
        this.setState({ favorites: newFavs })
        return i === -1
      }
    }

    updateSubscriptions(id) {
      const { subscriptions: newSubs } = this.state
      const i = newSubs.indexOf(id)
      if (i === -1) {
        newSubs.push(id)
        logEvent('subscribe', id)
        doApiRequest('/subscribe/?format=json', {
          method: 'POST',
          body: {
            club: id,
          },
        })
      } else {
        newSubs.splice(i, 1)
        logEvent('unsubscribe', id)
        doApiRequest(`/subscribe/${id}/?format=json`, {
          method: 'DELETE',
        })
      }
      this.setState({ subscriptions: newSubs })
      return i === -1
    }

    updateUserInfo() {
      doApiRequest('/clubs/?format=json')
        .then(resp => resp.json())
        .then(data => this.setState({ clubs: data }))
      doApiRequest('/settings/?format=json').then(resp => {
        if (resp.ok) {
          resp.json().then(userInfo => {
            // redirect to welcome page if user hasn't seen it before
            if (userInfo.has_been_prompted === false && window.location.pathname !== '/welcome') {
              window.location.href = '/welcome?next=' + encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)
            }

            this.setState({
              authenticated: true,
              favorites: userInfo.favorite_set.map(a => a.club),
              subscriptions: userInfo.subscribe_set.map(a => a.club),
              userInfo,
            })
          })
        } else {
          this.setState({
            authenticated: false,
            favorites: [],
            subscriptions: [],
          })
        }
      })
    }
  }

  if (Page.getInitialProps) {
    RenderPage.getInitialProps = async info => {
      return Page.getInitialProps(info)
    }
  }

  return RenderPage
}

export function renderListPage(Page) {
  class RenderListPage extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        clubs: props.clubs,
      }
    }

    componentDidMount() {
      doApiRequest('/clubs/?format=json')
        .then(resp => resp.json())
        .then(data => this.setState({ clubs: data }))
    }

    render() {
      const { tags, favorites, updateUserInfo, updateFavorites } = this.props
      const { clubs } = this.state

      if (!clubs) {
        return <Loading />
      }

      return (
        <Page
          clubs={clubs}
          tags={tags}
          favorites={favorites}
          updateFavorites={updateFavorites}
          updateUserInfo={updateUserInfo}
        />
      )
    }
  }

  RenderListPage.getInitialProps = async () => {
    const tagsRequest = await doApiRequest('/tags/?format=json')
    const tagsResponse = await tagsRequest.json()

    return { tags: tagsResponse }
  }

  return renderPage(RenderListPage)
}

export default renderPage
