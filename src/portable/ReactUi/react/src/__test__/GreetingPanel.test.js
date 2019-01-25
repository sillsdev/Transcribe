/* jshint esversion: 6 */
import React from 'react';
import expect from 'expect';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import GreetingPanel from '../components/GreetingPanel';


configure({ adapter: new Adapter() })

// Snapshot for GreetingPanel
describe('>>>Control: GreetingPanel --- Snapshot',()=>{
    const minProps = {
        strings: { congratulations: "Congratulations", youhavereached: "You have reached", haveaniceday: "Have a nice day", inboxzero: "zero inbox"}
    };

    it('+++capturing Snapshot of GreetingPanel', () => {
        const renderedValue =  renderer.create(<GreetingPanel {...minProps}/>).toJSON()
        expect(renderedValue).toMatchSnapshot(1);
    });
});

