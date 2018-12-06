/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import { AddManyTasks } from '../components/AddManyTasks';

configure({ adapter: new Adapter() });

// Snapshot for AddManyTasks
describe('>>>Control: AddManyTasks --- Snapshot',()=>{
    const minProps = {
        direction: "ltr",
        selectedProject: "ztt",
        selectedUser: "admin",
        strings: {
            "browse": "Browse",
        },
        strings2: {
            "batchUpload": "batch upload spreadsheet",
            "learnToAddMany": "Learn to create a {0} or to rename your audio file with {1}.",
            "ourNamingConvention": "our naming convention",
        },
    };

    it('+++capturing Snapshot of AddManyTasks', () => {
        const renderedValue =  renderer.create(<Router><AddManyTasks {...minProps} snapShotTest={true}/></Router>).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: AddManyTasks', () => {
    let wrapper;
    const minProps = {
        direction: "ltr",
        selectedProject: "ztt",
        selectedUser: "admin",
        strings: {
            "browse": "Browse",
        },
        strings2: {
            "batchUpload": "batch upload spreadsheet",
            "learnToAddMany": "Learn to create a {0} or to rename your audio file with {1}.",
            "ourNamingConvention": "our naming convention",
        },
    };

    beforeEach(() => {
        wrapper = shallow(<AddManyTasks {...minProps} />);
    });

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
