import React, { Component } from 'react';
import _ from 'lodash';

import logo from './logo.svg';
import './App.css';
import { Story } from 'inkjs/dist/ink';
import data from './storyData/FRC Assistant.js.json';
import resources from './storyData/resources.json';


import { Transition, Container, Divider, Label, Grid, Header, Menu, Segment, Table, Feed, Icon, Image } from 'semantic-ui-react'


// Yeah, this is kinda hacky, inky exports v18 files but inkjs only deals with v17 files
// The main differences are in whitespace handling which, for html, is irrelevant... so far
data.inkVersion = 17;


class App extends Component {
  constructor() {
    super();
    this.story = new Story(data);
    this.state = { messages: [], choices: [] };

  }

  componentDidMount() {
    const { messages, choices } = this.continueStory();
    this.setState({ messages, choices })
  }

  extractTag(tag) {
    let tagParsed = JSON.parse(tag);
    let data = _.get(resources, tagParsed.resource);
    return { type: 'tag', path: tagParsed.resource, data }
  }

  continueStory = () => {
    let messages = [];
    let count = 0;
    while (this.story.canContinue) {

      this.story.Continue();
      let tags = this.story.currentTags.map(this.extractTag);
      messages = [...messages, ...tags];
      messages.push({ type: 'story', message: this.story.currentText });
      // console.log(this.story.currentText, count++);

      // console.log(tags);


    }
    let choices = this.story.currentChoices.map((c, i) => { return { type: 'choice', message: c.text, choiceIndex: i } })
    return { messages, choices };
  }

  chooseOption = (i) => {
    return () => {
      this.story.ChooseChoiceIndex(i);
      this.story.Continue();
      const { messages, choices } = this.continueStory();

      this.setState({ messages, choices })
    }
  }

  render() {
    console.log(this.state);

    return (
      <div>
        <Container style={{ padding: '5em 0em' }}>
          <Header as='h1'>FRC Assistant</Header>
          <Feed>
              {this.state.messages.map((m, i) => <Message key={i} message={m} onChoiceClick={this.chooseOption} />)}
          </Feed>
          <div className="choices">
            {this.state.choices.map((m, i) => <Choice className="choice" key={i} message={m} onChoose={this.chooseOption} />)}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;

const Message = ({ message, index, onChoiceClick }) => {
  switch (message.type) {
    case 'story':
      return <BotResponse message={message} />
    case 'choice':
      return <Choice message={message} onChoose={onChoiceClick} />
    case 'tag':
      return <Tag message={message} />
    default:
      return null;
  }
}

const BOT_ICON = <Feed.Label ><Icon size="small" name="github alternate" /></Feed.Label>


const BotResponse = ({ message }) => {
  return (
    <Feed.Event>
      {BOT_ICON}
      <Feed.Content content={message.message} />
    </Feed.Event>
  )
}

const Choice = ({ message, onChoose }) => {
  return (
    <div className="choice">
      <Label color="teal" as='a' onClick={onChoose(message.choiceIndex)} size="large">
        {message.message}
      </Label>
    </div>
  )
}

const Tag = ({ message }) => {
  if (!message.data) {
    return (
      <Feed.Event>
        {BOT_ICON}
        <Feed.Content>
          I'm supposed to know of a resource here at <strong>{message.path}</strong> but it didn't load correctly.
      </Feed.Content>
      </Feed.Event>
    )
  }
  return (

    <Feed.Event>
      {BOT_ICON}
      <Feed.Content>
        <Feed.Extra images>
          <a href={message.data.link} target="_blank">
            <Image src={message.data.thumbnail} size="big" />
          </a>
        </Feed.Extra>
        <Feed.Meta>
          Source: {message.data.source}
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>

  );
}


// <div className='resource'>
//       <div className='thumbnail'>
//         <a href={message.data.link} target="_blank">
//           <img src={message.data.thumbnail} />
//         </a>
//       </div>
//       <div>
//         Source: {message.data.source}
//       </div>

//     </div>