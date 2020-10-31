import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Link from 'next/link';
import React from 'react';

import MenuWithLinks from '../common/MenuWithLinks';
import Confirmer from '../common/Confirmer';
import Notifier from '../common/Notifier';

import { Store } from '../../lib/store';
import DiscussionList from '../discussions/DiscussionList';

const dev = process.env.NODE_ENV !== 'production';

const styleGrid = {
  width: '100vw',
  minHeight: '100vh',
  maxWidth: '100%',
  padding: '0px 10px',
};

const styleGridIsMobile = {
  width: '100vw',
  minHeight: '100vh',
  maxWidth: '100%',
  padding: '0px 0px 0px 10px',
};

function LayoutWrapper({
  children,
  isMobile,
  firstGridItem,
  store,
}: {
  children: React.ReactNode;
  isMobile: boolean;
  firstGridItem: boolean;
  store: Store;
}) {
  return (
    <React.Fragment>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        style={isMobile ? styleGridIsMobile : styleGrid}
      >
        {firstGridItem ? (
          <Grid
            item
            sm={2}
            xs={12}
            style={{
              borderRight: '1px #707070 solid',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <MenuWithLinks
                options={[
                  {
                    text: 'Team Settings',
                    href: `/team-settings?teamSlug=${store.currentTeam.slug}`,
                    as: `/team/${store.currentTeam.slug}/team-settings`,
                    simple: true,
                  },
                  {
                    text: 'Billing',
                    href: `/billing?teamSlug=${store.currentTeam.slug}`,
                    as: `/team/${store.currentTeam.slug}/billing`,
                    simple: true,
                  },
                  {
                    text: 'Your Settings',
                    href: '/your-settings',
                    highlighterSlug: '/your-settings',
                  },
                  {
                    separator: true,
                  },
                  {
                    text: 'Log out',
                    href: `${dev ? process.env.URL_API : process.env.PRODUCTION_URL_API}/logout`,
                    as: `${dev ? process.env.URL_API : process.env.PRODUCTION_URL_API}/logout`,
                    externalServer: true,
                  },
                ]}
              >
                <Avatar
                  src={store.currentUser.avatarUrl}
                  alt="Add username here later in the book"
                  style={{
                    margin: '20px auto',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    width: '40px',
                    height: '40px',
                  }}
                />

                <i className="material-icons" color="action" style={{ verticalAlign: 'super' }}>
                  arrow_drop_down
                </i>
              </MenuWithLinks>
            </div>
            <hr />
            <p />
            <p />
            <DiscussionList store={store} team={store.currentTeam} isMobile={isMobile} />
            <Link
              href={`/words?teamSlug=${store.currentTeam.slug}`}
              as={`/team/${store.currentTeam.slug}/words`}
            >
              <a style={{ fontWeight: 300 }}>Words</a>
            </Link>
          </Grid>
        ) : null}

        {children}
      </Grid>
      <Notifier />
      <Confirmer />
    </React.Fragment>
  );
}

type Props = {
  children: React.ReactNode;
  isMobile?: boolean;
  firstGridItem?: boolean;
  store?: Store;
  teamRequired?: boolean;
};

class Layout extends React.Component<Props> {
  public render() {
    const { children, isMobile, firstGridItem, store, teamRequired } = this.props;

    const { currentUser, currentTeam } = store;

    if (!currentUser) {
      return (
        <LayoutWrapper
          firstGridItem={firstGridItem}
          isMobile={isMobile}
          store={store}
        >
          <Grid item sm={12} xs={12}>
            {children}
          </Grid>
        </LayoutWrapper>
      );
    }

    if (!currentTeam) {
      if (teamRequired) {
        return (
          <LayoutWrapper
            firstGridItem={firstGridItem}
            isMobile={isMobile}
            store={store}
          >
            <Grid item sm={10} xs={12}>
              <div style={{ padding: '20px' }}>
                Select existing team or create a new team.
                <p />
                <Link href="/create-team" as="/create-team">
                  <Button variant="outlined" color="primary">
                    Create new team
                  </Button>
                </Link>
              </div>
            </Grid>
          </LayoutWrapper>
        );
      } else {
        console.log('team not required');
        return (
          <LayoutWrapper
            firstGridItem={firstGridItem}
            isMobile={isMobile}
            store={store}
          >
            <Grid item sm={10} xs={12}>
              {children}
            </Grid>
          </LayoutWrapper>
        );
      }
    }

    return (
      <LayoutWrapper
        firstGridItem={firstGridItem}
        isMobile={isMobile}
        store={store}
      >
        <Grid item sm={firstGridItem ? 10 : 12} xs={12}>
          <div>
            {isMobile || store.currentUrl.includes('create-team') ? null : (
              <React.Fragment>
                <i
                  style={{
                    float: 'left',
                    margin: '15px 0px 10px 25px',
                    opacity: 0.8,
                    fontSize: '18px',
                    cursor: 'pointer',
                    verticalAlign: 'top',
                  }}
                  className="material-icons"
                  onClick={async () => {
                    await store.currentUser.toggleTheme(!store.currentUser.darkTheme);
                  }}
                >
                  lens
                </i>
              </React.Fragment>
            )}
            <div style={{ clear: 'both' }} />
          </div>
          {children}
        </Grid>
      </LayoutWrapper>
    );
  }
}

export default Layout;
