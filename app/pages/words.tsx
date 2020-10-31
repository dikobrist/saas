import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from '../lib/store';
import withAuth from '../lib/withAuth';
import Layout from '../components/layout';
import Head from 'next/head';

type Props = {
  store: Store;
  teamSlug: string;
  isServer: boolean;
  isMobile: boolean;
};

type State = {};

class WordsPageComp extends React.Component<Props, State> {
  public render() {
    const { store, isMobile } = this.props;
    const { currentTeam } = store;

    if (!currentTeam || currentTeam.slug !== this.props.teamSlug) {
      return (
        <Layout {...this.props}>
          <Head>
            <title>No Team is found.</title>
          </Head>
          <div style={{ padding: isMobile ? '0px' : '0px 30px' }}>No Team is found.</div>
        </Layout>
      );
    }

    return (
      <Layout {...this.props}>
        <Head>
          <title>loaded ok</title>
        </Head>
        <div style={{ padding: isMobile ? '0px' : '0px 30px' }}>words to load</div>
      </Layout>
    );
  }
}

export default withAuth(observer(WordsPageComp));
