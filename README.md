
![Wonderland](https://user-images.githubusercontent.com/38309438/227752369-60583dc3-9463-4651-bac7-818d6971a636.png)

# Wonderland

Wonderland is a collaborative AI art canvas: think r/place meets modern diffusion AI. We wanted to create a way for people to generate and modify images together, and observe how AI art evolves and changes based on their prompts. By using a combination of web-sockets and svelte and self hosted AI, we were able to achieve our goal: a collaborative, community-driven AI art experience.

## Tech

Our backend is a split model. We handle all AI between NodeJS Express + Python Flask.

The flask server is responsible for hosting the AI. It is held behind a local proxy, and used to mutate images based on user input. 

The NodeJS server is our central logic server. It handles all web-socket connections, and is responsible for sending and receiving data from the AI server. It also handles all user authentication, and is responsible for storing user data.

We used Socket.io for our web-socket implementation. We used Svelte for our frontend, Tailwind because CSS sucks. We decided not to use a database, and store all memory locally.

## Limitations
Unfortunately, we did not have access to a cloud platform to host our AI engine. To address this, we self-host the AI at the cost of performance. We wanted to use a local hosted model, to maintain control and our open source values, which forced us to split our backend between Python and NodeJS. Connection our two backends was hard; we were forced to learn a lot about encoding and use DataURI's to send images across languages with performance.

Beyond that, with no could credits we weren't able to get a domain, or any ssl. To still share our collaborative spirit, we figured out how to host locally on the Polsky Lan Wifi, and one of our local computer was able to hold sockets open with 22 computers at once while running the AI.

## What's next
Exploring cloud platforms to host AI engine. 

Drafting methods to deploy application world-wide. ```ngrok``` may be a temporary solution. 


## Getting Started

### Hardware
Currently will not work for non-Apple CPUs. Switch MPS to CUDA if needed. 



### Dependencies

* pnpm 

  ```npm install -g pnpm```


### Installation

In terminal - ```pip install -r generator/requirements.txt```. Run ```app.py```. Wait for downloads before entering prompts. 


Separate terminal - ```cd server```, install packages using ```pnpm i``` then run  ```pnpm watch:start```.


In another separate terminal - ```cd web```, install packages using ```pnpm i``` then run  ```pnpm run dev```.


Click localhost link provided ```http://127.0.0.1:5173/```

## Other
[Devpost Link](https://devpost.com/software/wonderland-ykjtug)

