use starknet::{ContractAddress};

#[starknet::interface]
pub trait ICounter<T>{
    fn get_counter(self: @T) -> u32;
    fn increase_counter(ref self: T);
}

#[starknet::contract]
pub mod counter_contract {
    use super::{ICounter};
    use starknet::event::EventEmitter;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry, Map
    };
    use starknet::{ContractAddress, get_caller_address};

    #[storage]
    struct Storage {
        counter: u32,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CounterIncreased: CounterIncreased,
    }

    #[derive(Drop, starknet::Event)]
    pub struct CounterIncreased {
        pub by: ContractAddress,
        pub value: u32,
    }


    #[abi(embed_v0)]
    impl CounterImpl of ICounter<ContractState>{
        fn get_counter(self: @ContractState) -> u32 {
            self.counter.read()
        }
        
        fn increase_counter(ref self: ContractState) {
            let caller: ContractAddress = get_caller_address();

            self.counter.write(self.get_counter() + 1);

            self.emit( CounterIncreased {by: caller, value: self.get_counter()}); 
            
        }

    }
}