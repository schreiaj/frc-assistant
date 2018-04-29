import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Story} from 'inkjs';
import data from './storyData/FRC Assistant';

class App extends Component {
  constructor() {
    super();
    this.story = new Story(data);
  
  }

  chooseOption = (i) => {
    return () => {
      this.story.ChooseChoiceIndex(i);
      this.story.Continue();
      this.setState({})
    }
  }

  render() {
    let content = [];
    let tags = []
    while(this.story.canContinue) {
      this.story.Continue();
      content.push(this.story.currentText)
      tags = [...tags, ...this.story.currentTags.map( t => JSON.parse(t))];
    }
     
    console.log(tags);
    
    
    
    
    return (
      <div className="App container">
        {content.map((line, i) => <div className='bot-response' key={i}>{line}</div>)}
        {this.story.currentChoices.map((choice, i) => <div className='choice' key={i} onClick={this.chooseOption(i)}>{choice.text}</div>)}
      </div>
    );
  }
}

export default App;
