# Sequence Diagram Editor

Sequence Diagrams inside your favourite IDE. Simply define the sequences and see nicely rendered sequence diagrams. Inspiread by another great extension yuml diagrams.


```
#simple example
```

#simple render



```
# {threaded:false}
# {exportType:png}

bfs:BFS[a]
/queue:FIFO
someNode:Node
node:Node
adjList:List
adj:Node

bfs:queue.new
bfs:someNode.setLevel(0)
bfs:queue.insert(someNode)
[c:loop while queue != ()]
  bfs:node=queue.remove()
  bfs:level=node.getLevel()
  bfs:adjList=node.getAdjacentNodes()
  [c:loop 0 <= i < #adjList]
    bfs:adj=adjList.get(i)
    bfs:nodeLevel=adj.getLevel()
    [c:alt nodeLevel IS NOT defined]
      bfs:adj.setLevel(level+1)
      bfs:queue.insert(adj)
      --[else]
      bfs:nothing to do
    [/c]
  [/c]
[/c]
bfs:queue.destroy()
```

![Rendered diagram](https://github.com/ferdaarikan/vscode-sdedit/raw/master/images/sample.png)


## Features
 * You can easily include sequence diagrams to your projects. This is very helpful when you would like use the same IDE to switch between the source code and the diagrams. 
 * This extension contributes a new language and all files with .sd extension will be rendered as a diagram. All diagrams are shown on the same document tb instead of creating lots of new tabs. 
* In the future I would like to improve the language support. At the moment a minimal grammar and language syntax is provided. I would like to also make the renderer more responsive.

## Requirements

Diagrams are rendered in a seperate JVM process. A working JAVA (version 5 or higher) installation is required. 

## Extension Settings


## Legal
This extension uses Quick Sequence Diagram editor by Markus Strauch as renderer. Please see the license details below.

`Author`
Markus Strauch <markus-strauch {AT} arcor {DOT} de>

`Copyright`
Copyright (c) 2006 - 2008, Markus Strauch. All rights reserved.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

`Icon`
https://dribbble.com/ruslan_dezign

## Known Issues

None right now

## Release Notes

### 0.0.1

Initial release of sdedit, sequence diagram editor

### 0.0.2

Readme changes, fixed broken preview image
Added extension icon

### 0.0.3

Improved documentation
Added sample code snippets
