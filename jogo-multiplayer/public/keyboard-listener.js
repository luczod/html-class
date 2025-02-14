export default function createKeyboardListner(document) {
  const state = {
    observers: [],
    playerId: "",
  };

  function subscribe(observerFunction) {
    state.observers.push(observerFunction);
  }

  function registerPlayerId(playerId) {
    state.playerId = playerId;
  }

  function notifyAll(command) {
    console.log(
      `KeyboardListener -> Notifying ${state.observers.length} obeservers`
    );

    for (const observerFunction of state.observers) {
      observerFunction(command);
    }
  }

  document.addEventListener("keydown", handlerKeydown);

  function handlerKeydown(event) {
    const keyPressed = event.key;

    const command = {
      type: "move-player",
      playerId: state.playerId,
      keyPressed,
    };

    notifyAll(command);
  }

  return {
    subscribe,
    registerPlayerId,
  };
}
