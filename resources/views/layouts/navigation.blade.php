<nav x-data="{ open: false }" class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center gap-6">
                <a href="/" class="flex items-center gap-2 font-semibold text-indigo-700">
                    <x-application-logo class="block h-9 w-auto fill-current text-gray-800" />
                    <span class="hidden sm:inline text-slate-800">{{ config('app.name', 'Tour') }}</span>
                </a>
                <div class="hidden sm:flex sm:items-center sm:space-x-6">
                    @if(!auth()->check() || (auth()->check() && auth()->user()->role === 'customer'))
                        <a href="/" class="text-sm font-semibold {{ request()->is('/') ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700' }}">Katalog</a>
                    @endif
                    @auth
                        @if(auth()->user()->role === 'customer')
                            <a href="/pesanan-saya" class="text-sm font-semibold {{ request()->is('pesanan-saya') ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700' }}">Pesanan Saya</a>
                        @elseif(auth()->user()->role === 'admin')
                            <a href="{{ route('admin.paket.index') }}" class="text-sm font-semibold {{ request()->is('admin/paket*') ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700' }}">Kelola Paket</a>
                            <a href="{{ route('admin.pesanan.index') }}" class="text-sm font-semibold {{ request()->is('admin/pesanan*') ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700' }}">Kelola Pesanan</a>
                        @elseif(auth()->user()->role === 'owner')
                            <a href="{{ route('owner.rekapitulasi') }}" class="text-sm font-semibold {{ request()->is('owner/rekapitulasi') ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700' }}">Rekap Penjualan</a>
                        @endif
                        <a href="{{ route('dashboard') }}" class="text-sm font-semibold {{ request()->routeIs('dashboard') ? 'text-indigo-700' : 'text-slate-600 hover:text-indigo-700' }}">Dashboard</a>
                    @endauth
                </div>
            </div>

            <div class="hidden sm:flex sm:items-center sm:gap-4">
                @auth
                    <x-dropdown align="right" width="48">
                        <x-slot name="trigger">
                            <button class="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-600 bg-white hover:text-gray-800 focus:outline-none transition ease-in-out duration-150">
                                <div class="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                    {{ strtoupper(substr(auth()->user()->name,0,1)) }}
                                </div>
                                <div class="hidden md:block text-left">
                                    <p class="text-sm font-semibold text-slate-800">{{ auth()->user()->name }}</p>
                                    <p class="text-xs text-slate-500 capitalize">{{ auth()->user()->role }}</p>
                                </div>
                                <div class="ms-1">
                                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        </x-slot>

                        <x-slot name="content">
                            <x-dropdown-link :href="route('profile.edit')">
                                {{ __('Profile') }}
                            </x-dropdown-link>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <x-dropdown-link :href="route('logout')" onclick="event.preventDefault(); this.closest('form').submit();">
                                    {{ __('Log Out') }}
                                </x-dropdown-link>
                            </form>
                        </x-slot>
                    </x-dropdown>
                @else
                    <a href="/login" class="text-sm font-semibold text-slate-600 hover:text-indigo-700">Login</a>
                    <a href="/register" class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">Daftar</a>
                @endauth
            </div>

            <div class="-me-2 flex items-center sm:hidden">
                <button @click="open = ! open" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <div :class="{'block': open, 'hidden': ! open}" class="hidden sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
            @if(!auth()->check() || (auth()->check() && auth()->user()->role === 'customer'))
                <x-responsive-nav-link href="/" :active="request()->is('/')">
                    Katalog
                </x-responsive-nav-link>
            @endif
            @auth
                @if(auth()->user()->role === 'customer')
                    <x-responsive-nav-link href="/pesanan-saya" :active="request()->is('pesanan-saya')">
                        Pesanan Saya
                    </x-responsive-nav-link>
                @elseif(auth()->user()->role === 'admin')
                    <x-responsive-nav-link :href="route('admin.paket.index')" :active="request()->is('admin/paket*')">
                        Kelola Paket
                    </x-responsive-nav-link>
                    <x-responsive-nav-link :href="route('admin.pesanan.index')" :active="request()->is('admin/pesanan*')">
                        Kelola Pesanan
                    </x-responsive-nav-link>
                @elseif(auth()->user()->role === 'owner')
                    <x-responsive-nav-link :href="route('owner.rekapitulasi')" :active="request()->is('owner/rekapitulasi')">
                        Rekap Penjualan
                    </x-responsive-nav-link>
                @endif
                <x-responsive-nav-link :href="route('dashboard')" :active="request()->routeIs('dashboard')">
                    Dashboard
                </x-responsive-nav-link>
            @endauth
        </div>

        <div class="pt-4 pb-1 border-t border-gray-200">
            @auth
                <div class="px-4">
                    <div class="font-medium text-base text-gray-800">{{ auth()->user()->name }}</div>
                    <div class="font-medium text-sm text-gray-500">{{ auth()->user()->email }}</div>
                </div>
                <div class="mt-3 space-y-1">
                    <x-responsive-nav-link :href="route('profile.edit')">
                        {{ __('Profile') }}
                    </x-responsive-nav-link>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <x-responsive-nav-link :href="route('logout')" onclick="event.preventDefault(); this.closest('form').submit();">
                            {{ __('Log Out') }}
                        </x-responsive-nav-link>
                    </form>
                </div>
            @else
                <div class="px-4 space-y-2">
                    <a href="/login" class="block text-sm font-semibold text-slate-700">Login</a>
                    <a href="/register" class="block text-sm font-semibold text-indigo-700">Daftar</a>
                </div>
            @endauth
        </div>
    </div>
</nav>
