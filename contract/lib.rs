use anchor_lang::prelude::*;

declare_id!("8b8P9CM4mjSS2DUp1xGRb5HvcESeNQjXPxwmkXNazeTL");

#[program]
pub mod solana_deposit_contract {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let user = &ctx.accounts.user;
        let contract_account = &mut ctx.accounts.contract_account;

        // Transfer lamports from the user to the contract account
        **contract_account.to_account_info().try_borrow_mut_lamports()? += amount;
        **user.to_account_info().try_borrow_mut_lamports()? -= amount;

        Ok(())
    }

    pub fn distribute(ctx: Context<Distribute>, points: u64, multiple: u64) -> Result<u64> {
        let contract_account = &mut ctx.accounts.contract_account;
        let to_account = &mut ctx.accounts.to;

        let quotient = points / multiple;
        let remainder = points % multiple;
        let amount_to_send = quotient * 1_000_000; // 0.01 SOL = 1_000_000 lamports

        **contract_account.to_account_info().try_borrow_mut_lamports()? -= amount_to_send;
        **to_account.to_account_info().try_borrow_mut_lamports()? += amount_to_send;

        Ok(remainder)
    }
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub contract_account: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Distribute<'info> {
    #[account(mut)]
    pub contract_account: AccountInfo<'info>,
    #[account(mut)]
    pub to: AccountInfo<'info>,
}
