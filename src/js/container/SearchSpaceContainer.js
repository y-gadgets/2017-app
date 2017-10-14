import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ListIcon from 'material-ui/svg-icons/action/list';

import Navigation from "../components/Navigation";
import SearchAppBar from "../components/SearchAppBar";

import {loadBooths} from '../modules/firebase';
import BoothList from "../components/BoothList";

class SearchSpaceContainer extends React.Component {
    state = {
        isSearching: false,
        searchText: ''
    };

    showSearchList = () => {
        this.setState({isSearching: true})
    };

    showGeneralList = () => {
        this.setState({isSearching: false})
    };

    handleClickBoothItem = (id) => {
        this.props.push(`/booths/${id}`);
    };

    handleChangeSearchText = (event, newValue) => {
        this.setState({searchText: newValue});
    };

    getStyles = () => {
        return {
            appBar: {
                position: 'fixed',
                top: 0,
                zIndex: 2
            },
            navigation: {
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 2
            },
            content: {
                marginTop: 64,  // spacing.desktopKeylineIncrement
                marginBottom: 56, // getMuiTheme.bottomNavigation.height
            }
        }
    };

    componentDidMount() {
        this.props.loadBooths();
    }

    render() {
        const styles = this.getStyles();
        const {searchText, isSearching} = this.state;
        const {booths, pinedBooths} = this.props;
        const randomBooths = booths.sortBy(Math.random).slice(0, 5);
        const searchedBooths = booths.filter((b) => {
            return [b.name, b.locationName, b.owner, b.description].join('').indexOf(searchText) !== -1;
        });

        const content =
            isSearching ? (
                    <div>
                        <SearchAppBar
                            value={searchText}
                            style={styles.appBar}
                            onClickBack={this.showGeneralList}
                            onChange={this.handleChangeSearchText}/>
                        <div style={styles.content}>
                            <BoothList
                                booths={searchedBooths}
                                onClick={this.handleClickBoothItem}/>
                        </div>
                    </div>
                ) :
                (
                    <div>
                        <AppBar
                            showMenuIconButton={false}
                            iconElementRight={
                                <div>
                                    <IconButton onClick={this.showSearchList}><SearchIcon/></IconButton>
                                    <IconButton><ListIcon/></IconButton>
                                </div>}/>
                        <BoothList
                            subheader="Pined booths"
                            booths={pinedBooths}
                            onClick={this.handleClickBoothItem}/>
                        <Divider/>
                        <BoothList
                            subheader="Random recommend booths"
                            booths={randomBooths}
                            onClick={this.handleClickBoothItem}/>
                    </div>
                );

        return (
            <div>
                {content}
                <Navigation
                    style={styles.navigation}
                    activeIndex={0}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const booths = state.firebase.booths;
    const pinedIds = state.firebase.get('pins');
    const pinedBooths = pinedIds.map((value, key) => booths.get(key));

    return {
        booths,
        pinedBooths
    }
}

function mapDispatchToProps(dispatch) {
    return {
        push: (path) => {
            dispatch(push(path))
        },
        loadBooths: () => {
            dispatch(loadBooths())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchSpaceContainer);

