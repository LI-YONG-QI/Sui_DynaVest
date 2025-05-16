import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Address } from "viem";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Token } from "@/types";
import { Button } from "@/components/ui/button";

const createWithdrawFormSchema = (balance: number) =>
  z.object({
    amount: z
      .string()
      .min(1, { message: "Amount is required" })
      .refine(
        (val) => {
          return !isNaN(parseFloat(val)) && parseFloat(val) > 0;
        },
        { message: "Must be a valid positive number" }
      )
      .refine(
        (val) => {
          const amount = parseFloat(val);
          return amount <= balance;
        },
        { message: "Amount cannot exceed your available balance" }
      ),
    to: z
      .string()
      .min(1, { message: "To is required" })
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
  });

// 添加balance到接口
interface WithdrawDialogProps {
  asset: Token;
  balance: number; // 资产余额
  onWithdraw: (amount: string, to: Address) => void;
}

export function WithdrawDialog({
  asset,
  balance,
  onWithdraw,
}: WithdrawDialogProps) {
  // 使用balance创建schema
  const withdrawFormSchema = createWithdrawFormSchema(balance);
  type WithdrawFormValues = z.infer<typeof withdrawFormSchema>;

  const form = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: "0",
      to: "",
    },
  });

  const onSubmit = (values: WithdrawFormValues) => {
    onWithdraw(values.amount, values.to as Address);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger className="px-3 py-1.5 rounded-lg text-sm text-primary hover:bg-gray-50 transition-colors">
        Withdraw
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw {asset.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <Image
                src={asset.icon}
                alt={asset.name}
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="font-medium">{asset.name}</span>
              <span className="ml-auto text-sm text-gray-500">
                Balance: {balance}
              </span>
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      className="flex-1 min-w-0 bg-transparent text-gray-500 block px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-0 focus:border-0 placeholder:text-gray-500"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Address</FormLabel>
                  <FormControl>
                    <Input
                      className="flex-1 min-w-0 bg-transparent text-gray-500 block px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-0 focus:border-0 placeholder:text-gray-500"
                      placeholder="0x..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="cursor-pointer flex items-center justify-center gap-2.5 rounded-lg bg-[#5F79F1] text-white py-3.5 px-5 disabled:opacity-50"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
