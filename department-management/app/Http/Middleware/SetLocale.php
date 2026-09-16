<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->route('lang')
            ?? $request->query('lang')
            ?? $request->session()->get('app_locale')
            ?? config('app.locale');

        $locale = in_array($locale, ['en', 'th'], true) ? $locale : config('app.locale');

        app()->setLocale($locale);
        $request->session()->put('app_locale', $locale);

        return $next($request);
    }
}
