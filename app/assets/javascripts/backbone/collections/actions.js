Structural.Collections.Actions = Backbone.Collection.extend({
  model: Structural.Models.Action,
  url: function() {
    return Structural.apiPrefix + '/conversations/' + this.conversationId + '/actions';
  },
  initialize: function(data, options) {
    options = options || {};
    this.conversationId = options.conversation;
    this.userId = options.user;
    this.on('reset', this._findMyMessages, this);
    this.on('reset', this._findFocusedMessage, this);
    this.on('add', this.setStateOnNewAction, this);
    this.on('add', function(model, collection, options) {
      this.trigger('unreadCountChanged');
    });
    this.on('add', this.triggerNewMessage, this);
  },
  comparator: 'timestamp',

  _findMyMessages: function() {
    this.forEach(function(action) {
      if (action.get('user').id === this.userId) {
        action.mine();
      }
    }, this);
  },

  _findFocusedMessage: function() {
    if (this._idToFocus) {
      var action = this.get(this._idToFocus);
      if (action) {
        action.focus();
      }
    }
  },

  focus: function(id) {
    id = parseInt(id);
    var action = this.get(id);
    if(action) {
      action.focus();
    } else {
      this._idToFocus = id;
    }

    this.filter(function(act) { return act.isFocused() && act.id != id; })
        .forEach(function(act) {
      act.unfocus();
    });
  },

  clearFocus: function() {
    this._idToFocus = undefined;
    this.forEach(function(act) {
      act.unfocus();
    });
  },

  createRetitleAction: function(title, user) {
    this._newAction({
      type: 'retitle',
      title: title,
      user: {
        name: user.get('name'),
        id: user.id
      }
    });
  },
  createUpdateUserAction: function(added, removed, user) {
    this._newAction({
      type: 'update_users',
      user: {
        name: user.get('name'),
        id: user.id
      },
      added: new Structural.Collections.Participants(added).toJSON(),
      removed: new Structural.Collections.Participants(removed).toJSON()
    });
  },
  createMessageAction: function(text, user) {
    var model = this._newAction({
      type: 'message',
      text: text.trim(),
      user: {
        name: user.get('name'),
        id: user.id
      },
      timestamp: Date.now()
    });
  },
  createDeleteAction: function(action, user) {
    var model = new Structural.Models.Action({
      type: 'deletion',
      msg_id: action.id,
      user: {
        name: user.get('name'),
        id: user.id
      }
    });
    model.url = this.url();
    model.save();
    action.delete(user);
  },
  createMoveConversationAction: function(folder, user) {
    this._newAction({
      type: 'move_conversation',
      user: {
        name: user.get('name'),
        id: user.id
      },
      conversation_id: this.conversationId,
      to: {
        name: folder.get('name'),
        id: folder.id
      }
    });
  },
  createUpdateFoldersAction: function(added, removed, user) {
    this._newAction({
      type: 'update_folders',
      user: {
        name: user.get('name'),
        id: user.id
      },
      added: new Structural.Collections.Folders(added).toJSON(),
      removed: new Structural.Collections.Folders(removed).toJSON()
    });
  },

  // This actions collection's conversation is being viewed.
  viewActions: function() {
    var self = this;
    var options = {}
    if (this.length === 0) {
      options.reset = true;

      // We want to let our views know that they can go ahead and render the actions en block now,
      // since they're actually loaded.
      options.success = function() {
        self.trigger('actionsLoadedForFirstTime');
      }
    }
    this.fetch(options);
  },

  // TODO: Remove & remove references to it.
  clearConversation: function() {},

  setStateOnNewAction: function(model, collection) {
    if (model.get('user').id === this.userId) {
      model.mine();
    }
  },
  triggerNewMessage: function(model) {
    if (model.get('type') === 'message' &&
        model.get('user').id !== this.userId) {
      this.trigger('addedSomeoneElsesMessage')
    }
  },

  _newAction: function(data) {
    var model = new Structural.Models.Action(data);
    model.set('timestamp', (new Date()).valueOf());
    this.add(model);
    model.save();
    return model;
  },

  unreadCount: function(mostRecentEventViewed) {
    var count = 0;
    this.forEach(function(action) {
      count += action.isUnread(mostRecentEventViewed) ? 1 : 0;
    });
    return count;
  },

  fetch: function(options) {
    if (this.conversationId) {
      // http://rockycode.com/blog/backbone-inheritance/
      // God, I fucking hate javascript so much.  Is this really the best there
      // is for basic inheritance?  Should we be using mixins instead?
      return this.constructor.__super__.fetch.call(this, options);
    }
  }
});
