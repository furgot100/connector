'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('Comments', 'LobbyId', Sequelize.INTEGER).then(() => {
      return queryInterface.addConstraint('Comments', ['LobbyId'], {
        type: 'foreign key',
        name: 'lobby_comments',
        references: { //Required field
          table: 'Lobbies',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments', 'LobbyId');  
  }
};

// return .remove