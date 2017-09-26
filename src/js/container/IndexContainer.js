import React from 'react';

import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';

// TODO: replace icon
import SearchIcon from 'material-ui/svg-icons/action/search';
import MysteryIcon from 'material-ui/svg-icons/action/room';
import TweetIcon from 'material-ui/svg-icons/av/note';

import BoothComponent from '../components/BoothComponent';
import MysteryComponent from '../components/MysteryComponent';
import TweetsComponent from '../components/TweetsComponent';
import Navigation from "../components/Navigation";

class IndexContainer extends React.Component {
    handleClickNavigationButton = (index) => {
        switch (index) {
            case 1:
                this.props.history.push("/");
                break;
            case 2:
                this.props.history.push("timeline");
                break;
            case 0:
            default:
                break;
        }
    };

    getStyles = () => {
        return {
            navigation: {
                position: 'fixed',
                bottom: 0,
                width: '100%'
            }
        }
    };

    render() {
        const styles = this.getStyles();

        return (
            <div>
                <AppBar
                    showMenuIconButton={false}
                    title="Mystery"/>

                <Navigation
                    style={styles.navigation}
                    activeIndex={1}
                    onClick={(i) => this.handleClickNavigationButton(i)}/>
            </div>
        )
    }
}

export default IndexContainer;
