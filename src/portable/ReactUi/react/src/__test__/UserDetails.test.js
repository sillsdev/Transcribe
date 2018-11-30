/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import {UserDetails} from '../components/UserDetails';

configure({ adapter: new Adapter() });

// Snapshot for UserDetails
describe('>>>Control: UserDetails --- Snapshot',()=>{
    const minProps = {
        avatar: "/api/images/smile.svg",
        deleted: false,
        direction: "ltr",
        history: {
            location: {
                pathname: "/ProjectSettings/User"
            }
        },
        popupUser: "Erik",
        project: {
            id: "ztt",
            lang: "fr",
            task: []
        },
        selectedParatextProject: "",
        selectedProject: "ztt",
        setUserAvatar: () => {return},
        strings: {
            "admin": "Admin",
            "deleteUser": "Delete User",
            "discardChanges": "Discard Changes",
            "otherProjects": "Other Projects",
            "preview": "Preview",
            "reviewer": "Reviewer",
            "transcriber": "Transcriber",
            "userDetails": "User Details",
        },
        strings2: {
            "imageFile": "Image File",
            "name": "Name",
            "privilegeTier": "Privilege Tier",
        },
        users: [],
    };

    it('+++capturing Snapshot of UserDetails', () => {
        const renderedValue =  renderer.create(<Router><UserDetails {...minProps} snapShotTest={true}/></Router>).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: UserDetails', () => {
    let wrapper;
    const minProps = {
        avatar: "/api/images/smile.svg",
        deleted: false,
        direction: "ltr",
        history: {
            location: {
                pathname: "/ProjectSettings/User"
            }
        },
        popupUser: "Erik",
        project: {
            id: "ztt",
            lang: "fr",
            task: []
        },
        selectedParatextProject: "",
        selectedProject: "ztt",
        setUserAvatar: () => {return},
        strings: {
            "admin": "Admin",
            "deleteUser": "Delete User",
            "discardChanges": "Discard Changes",
            "otherProjects": "Other Projects",
            "preview": "Preview",
            "reviewer": "Reviewer",
            "transcriber": "Transcriber",
            "userDetails": "User Details",
        },
        strings2: {
            "imageFile": "Image File",
            "name": "Name",
            "privilegeTier": "Privilege Tier",
        },
        users: [],
    };

    beforeEach(() => {
        wrapper = shallow(<UserDetails {...minProps} />);
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
