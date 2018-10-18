import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BrowserRouter as Router} from 'react-router-dom';
import renderer from 'react-test-renderer'
import BackLink from '../components/controls/BackLink';

configure({ adapter: new Adapter() })

// Snapshot for BackLink
describe('>>>Control: Backlink --- Snapshot',()=>{
    it('+++capturing Snapshot of BackLink', () => {
        const renderedValue =  renderer.create(<Router><BackLink target={"/root"}/></Router>).toJSON()
        expect(renderedValue).toMatchSnapshot();
    });
});
//*******************************************************************************************************
describe('>>>Control: BackLink', () => {
    let wrapper;
    const minProps = {
        target: "/root",
    };

    beforeEach(()=>{
        wrapper = shallow(<BackLink {...minProps} />)
    })

    it('+++ renders without exploding', () => {
        expect(wrapper.length).toEqual(1);
    });
});
