use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
    system_instruction,
    program::invoke,
    program_error::ProgramError,
    program_pack::{IsInitialized, Pack, Sealed},
};

entrypoint!(process_instruction);

#[derive(Clone, Debug, Default, PartialEq)]
pub struct State {
    pub points: u64,
    pub multiple: u64,
    pub recipient: Pubkey,
}

impl Sealed for State {}

impl Pack for State {
    const LEN: usize = 64;
    fn pack_into_slice(&self, dst: &mut [u8]) {
        let (points_dst, rest) = dst.split_at_mut(8);
        let (multiple_dst, rest) = rest.split_at_mut(8);
        let (recipient_dst, _) = rest.split_at_mut(48);

        points_dst.copy_from_slice(&self.points.to_le_bytes());
        multiple_dst.copy_from_slice(&self.multiple.to_le_bytes());
        recipient_dst.copy_from_slice(self.recipient.as_ref());
    }

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let (points_src, rest) = src.split_at(8);
        let (multiple_src, rest) = rest.split_at(8);
        let (recipient_src, _) = rest.split_at(48);

        Ok(State {
            points: u64::from_le_bytes(points_src.try_into().unwrap()),
            multiple: u64::from_le_bytes(multiple_src.try_into().unwrap()),
            recipient: Pubkey::new_from_array(recipient_src.try_into().unwrap()),
        })
    }
}

impl IsInitialized for State {
    fn is_initialized(&self) -> bool {
        true // Adjust this based on your specific logic
    }
}

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let payer_account = next_account_info(accounts_iter)?;
    let program_account = next_account_info(accounts_iter)?;

    // Ensure the payer account has signed the transaction
    if !payer_account.is_signer {
        msg!("Payer account must be a signer");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Check if it's a deposit instruction
    if instruction_data.is_empty() {
        // Deposit functionality: Transfer SOL to the program account
        let lamports = payer_account.lamports();
        invoke(
            &system_instruction::transfer(&payer_account.key, &program_account.key, lamports),
            &[payer_account.clone(), program_account.clone()],
        )?;
        return Ok(());
    }

    // Deserialize the instruction data
    let state: State = State::unpack(instruction_data)?;

    // Calculate the reward
    let reward = state.points / state.multiple;
    let reward_sol = reward as u64 * 1_000_000_000 / 100; // Convert to lamports (0.01 SOL)
    let remainder = state.points % state.multiple;

    // Transfer the reward SOL to the recipient
    invoke(
        &system_instruction::transfer(&program_account.key, &state.recipient, reward_sol),
        &[program_account.clone()],
    )?;

    // Return the remainder
    msg!("Remainder: {}", remainder);

    Ok(())
}
