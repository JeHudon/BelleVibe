import React from 'react';
import { useNavigate } from 'react-router';

export function TopBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/connexion');
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-8 py-4">

                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Rechercher un client, compte, demande..."
                            className="pl-10 bg-gray-50 border-gray-200"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                    3
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <div className="max-h-96 overflow-y-auto">
                                <div className="p-3 hover:bg-gray-50 cursor-pointer border-b">
                                    <p className="text-sm font-medium">Nouvelle demande assignée</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Demande #2156 - Problème technique
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Il y a 15 minutes
                                    </p>
                                </div>

                                <div className="p-3 hover:bg-gray-50 cursor-pointer border-b">
                                    <p className="text-sm font-medium">Client en attente</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Sophie Gagnon - Compte NW-2024-001234
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Il y a 1 heure
                                    </p>
                                </div>

                                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                    <p className="text-sm font-medium">
                                        SLA proche de l'expiration
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Demande #1987 expire dans 2 heures
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Il y a 3 heures
                                    </p>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Profile menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.name?.charAt(0)}
                                    </span>
                                </div>

                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.role}
                                    </p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <span className="font-medium">{user?.email}</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <span className="text-sm text-gray-500">
                                    Rôle: {user?.role}
                                </span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="text-red-600"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </header>
    );
}