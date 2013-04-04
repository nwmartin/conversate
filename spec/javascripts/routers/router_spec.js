describe("Structural router", function() {
  var bootstrap;
  beforeEach(function() {
    var topics = [
      { name: "Conversations", id: 1 },
      { name: "Structural", id: 2 },
      { name: "Chatter", id: 3 }
    ];
    var conversations = [
      { title: "First",
        most_recent_message: 1,
        participants: []
      },
      { title: "Third",
        most_recent_message: 3,
        participants: []
      }
    ];
    var actions = [
      { type: "message",
        user: {
          name: "Ethan Allen",
          id: 2
        },
        timestamp: 1363802638003,
        id: 123,
        text: "This is a message"
      },
      { type: "retitle",
        user: {
          name: "Ethan Allen",
          id: 2
        },
        id: 878,
        timestamp: 1363802638003,
        title: "Conversation Title"
      },
      { type: "deletion",
        user: {
          name: "Ethan Allen",
          id: 2
        },
        id: 788,
        timestamp: 1363802638003,
        action_id: 123
      }
    ];
    var conversation = {
      name: "Conversation",
      id: 1
    };
    var participants = [
      { name: "Sharon Jones",
        id: 1
      },
      { name: "The Dap Kings",
        id: 2
      }
    ];
    var user = { full_name: "Jack Kennedy" };

    bootstrap = {
      topics: topics,
      conversations: conversations,
      actions: actions,
      participants: participants,
      conversation: conversation,
      user: user
    };
    // So that the router can access it.
    window.bootstrap = bootstrap;
    Backbone.history.start();
  });

  describe("knows the current topic", function() {
    it("at the index", function() {
      Backbone.history.navigate('/');

      expect(Structural.Router.currentTopicId).toEqual(1);
    })
  })
})
