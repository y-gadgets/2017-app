import React from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import SettingIcon from 'material-ui/svg-icons/action/settings';
import HelpIcon from 'material-ui/svg-icons/action/help-outline';

import Navigation from "../components/Navigation";
import MysteryComponent from "../components/MysteryComponent";
import MysteryComplete from "../components/MysteryComplete";
import MysteryHelpDialog from '../components/helpDialog/MysteryHelpDialog';

import {loadQuestions} from "../modules/firebase";
import {inputAnswer} from "../modules/mystery";

class IndexContainer extends React.Component {
    state = {
        isHelpOpen: false,
    };

    handleClickHelpButton = () => {
        this.setState({isHelpOpen: true});
    };

    handleRequestCloseHelp = () => {
        this.setState({isHelpOpen: false});
    };

    handleClickSettingButton = () => {
        this.props.history.push('setting');
    };

    handleInputAnswer = (questionId, value) => {
        this.props.inputAnswer(questionId, value)
    };

    getStyles = () => {
        const contentHorizontalMargin = 20;
        return {
            appBar: {
                position: 'fixed',
                top: 0,
            },
            navigation: {
                position: 'fixed',
                bottom: 0,
                width: '100%'
            },
            content: {
                textAlign: 'center',
                marginTop: 64,  // spacing.desktopKeylineIncrement
                // marginBottom: 56, // getMuiTheme.bottomNavigation.height
                marginRight: contentHorizontalMargin,
                marginLeft: contentHorizontalMargin,
            }
        }
    };

    componentDidMount() {
        this.props.loadQuestions();
    }

    render() {
        const styles = this.getStyles();
        const {isHelpOpen} = this.state;
        const {questions, userAnswers, isMysteryCompleted} = this.props;
        const mainContent = isMysteryCompleted ?
            <MysteryComplete/> :
            <MysteryComponent
                questions={questions}
                userAnswers={userAnswers}
                onChangeAnswer={this.handleInputAnswer}/>;

        const rightIcons = (
            <div>
                <IconButton onClick={this.handleClickHelpButton}><HelpIcon/></IconButton>
                <IconButton onClick={this.handleClickSettingButton}><SettingIcon/></IconButton>
            </div>
        );

        return (
            <div>
                <AppBar
                    showMenuIconButton={false}
                    iconElementRight={rightIcons}
                    style={styles.appBar}/>

                <div style={styles.content}>
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbE3YVHOGpos_emeI5vkcud_C7LQH1lQE6HS0AHYJdRA4mqA34"/>
                    {mainContent}
                </div>

                <Navigation
                    style={styles.navigation}
                    activeIndex={0}/>

                <MysteryHelpDialog
                    open={isHelpOpen}
                    onRequestClose={this.handleRequestCloseHelp}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        questions: state.firebase.questions,
        userAnswers: state.mystery.userAnswers,
        isMysteryCompleted: state.mystery.isCompleted,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadQuestions: () => {
            dispatch(loadQuestions())
        },
        inputAnswer: (questionId, value) => {
            dispatch(inputAnswer(questionId, value))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexContainer);
