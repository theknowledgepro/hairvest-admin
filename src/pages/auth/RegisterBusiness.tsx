import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerBusinessSchema, type RegisterBusinessFormValues } from '../../lib/schemas/auth.schemas';
import { useRegisterBusinessMutation } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';

export const RegisterBusiness: React.FC = () => {
    const { mutate: registerBusiness, isPending } = useRegisterBusinessMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterBusinessFormValues>({
        resolver: zodResolver(registerBusinessSchema),
    });

    const onSubmit = (data: RegisterBusinessFormValues) => {
        registerBusiness(data);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-6">
                <Link to="/auth/login" className="inline-flex items-center text-xs text-neutral-400 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="mr-1 h-3 w-3" /> Back to Login
                </Link>
                <h2 className="text-2xl font-bold text-white tracking-tight">Register Business</h2>
                <p className="text-neutral-400 text-sm mt-1">Create a new business account for your salon.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-neutral-300">Business Name</Label>
                    <Input
                        id="businessName"
                        placeholder="e.g. Bella's Salon"
                        {...register('businessName')}
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500"
                    />
                    {errors.businessName && (
                        <p className="text-xs text-red-400">{errors.businessName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-neutral-300">Admin Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="admin@bellas.com"
                        {...register('email')}
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-400">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-neutral-300">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        className="bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-400">{errors.password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20"
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
            </form>
        </div>
    );
};
