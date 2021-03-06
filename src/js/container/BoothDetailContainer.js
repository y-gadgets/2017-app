import React from 'react';
import {connect} from 'react-redux';
import {goBack} from 'react-router-redux';

import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';
import FavoriteIcon from 'material-ui/svg-icons/action/favorite';
import FavoriteBorderIcon from 'material-ui/svg-icons/action/favorite-border';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import VisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import FlatButton from 'material-ui/FlatButton';

import {loadBooths, postBoothLike, pinBooth, unpinBooth} from '../modules/firebase';

const BoothCard = (props) => {
    const {booth} = props;
    return (
        <Card>
            <CardMedia overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle"/>}>
                <img src="images/nature-600-337.jpg" alt=""/>
            </CardMedia>
            <CardTitle
                title={booth.name}
                subtitle={booth.locationName}/>
            <CardText>
                {booth.description}
            </CardText>
            <CardActions>
                <FlatButton
                    label={booth.likes.size}
                    icon={<FavoriteIcon/>}
                />
                <FlatButton
                    label={booth.pins.size}
                    icon={<VisibilityIcon/>}
                />
            </CardActions>
        </Card>)
};

class BoothDetailContainer extends React.Component {
    handleClickBack = () => {
        this.props.goBack();
    };

    handleClickHelpButton = () => {
    };

    handleLickButtonClick = () => {
        this.props.postLike();
    };

    handlePin = () => {
        this.props.pinBooth();
    };

    handleUnpin = () => {
        this.props.unpinBooth();
    };

    getStyles = () => {
        return {
            card: {},
            content: {
                marginTop: 64 + 20,
                marginLeft: 20,
                marginRight: 20,
            },
        }
    };

    componentDidMount() {
        if (!this.props.booth) {
            const {id} = this.props.match.params;
            const {loadBooths} = this.props;

            loadBooths(id);
        }

    }

    render() {
        const styles = this.getStyles();
        const {booth, isPined} = this.props;

        const rightIcons = (
            <div>
                <IconButton onClick={this.handleClickHelpButton}><HelpIcon/></IconButton>
                <IconButton onClick={this.handleLickButtonClick}><FavoriteBorderIcon/></IconButton>
                {isPined ?
                    <IconButton onClick={this.handleUnpin}><VisibilityIcon/></IconButton> :
                    <IconButton onClick={this.handlePin}><VisibilityOffIcon/></IconButton>
                }
            </div>
        );

        return (
            <div>
                <AppBar
                    iconElementLeft={<IconButton><ArrowBackIcon/></IconButton>}
                    onLeftIconButtonTouchTap={this.handleClickBack}
                    iconElementRight={rightIcons}
                    title="Detail"/>

                <div style={styles.content}>
                    {booth ?
                        (<BoothCard booth={booth}/>) :
                        (<CircularProgress/>)}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const boothId = ownProps.match.params.id;
    const booth = state.firebase.getIn(['booths', boothId]);
    const isPined = state.firebase.get('pins').has(boothId);

    return {
        booth,
        isPined
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    const boothId = ownProps.match.params.id;

    return {
        goBack: () => {
            dispatch(goBack())
        },
        loadBooths: (id) => {
            dispatch(loadBooths(id));
        },
        postLike: () => {
            dispatch(postBoothLike(boothId));
        },
        pinBooth: () => {
            dispatch(pinBooth(boothId));
        },
        unpinBooth: () => {
            dispatch(unpinBooth(boothId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoothDetailContainer);
