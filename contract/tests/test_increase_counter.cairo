use super::utils::{deploy_contract, Accounts};
use workshop::counter::{ICounterDispatcher, ICounterDispatcherTrait};
use snforge_std::{start_cheat_caller_address};

#[test]
fn increase_counter() {
    let contract_address = deploy_contract();
    let dispatcher = ICounterDispatcher { contract_address };

    dispatcher.increase_counter();
    dispatcher.increase_counter();
    dispatcher.increase_counter();
    let stored_counter = dispatcher.get_counter();
    assert!(stored_counter == 3, "Stored value not equal for ADDRESS_ONE");
}