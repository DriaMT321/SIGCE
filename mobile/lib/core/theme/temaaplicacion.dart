import 'package:flutter/material.dart';

class temaaplicacion {
  // Paleta oficial institucional - Colegio Comunidad Cristiana
  static const Color lienzo = Color(0xFFF8FAFC);
  static const Color superficie = Color(0xFFFFFFFF);
  static const Color tinta = Color(0xFF1E293B);
  static const Color tintatenue = Color(0xFF64748B);
  static const Color borde = Color(0xFFE2E8F0);
  static const Color bordedecontrol = Color(0xFFCBD5E1);

  // Colores del logotipo oficial
  static const Color marca = Color(0xFF8B1820); // Vino tinto institucional
  static const Color fondomarca = Color(0xFFFEE2E2);
  static const Color secundario = Color(0xFFC2410C); // Naranja cálido cruz
  static const Color fondosecundario = Color(0xFFFFEDD5);
  static const Color acento = Color(0xFFD97706); // Ámbar
  static const Color fondoacento = Color(0xFFFEF3C7);

  // Estados
  static const Color exito = Color(0xFF15803D);
  static const Color fondoexito = Color(0xFFDCFCE7);
  static const Color advertencia = Color(0xFFB45309);
  static const Color fondoadvertencia = Color(0xFFFEF3C7);
  static const Color bordeadvertencia = Color(0x33B45309);
  static const Color error = Color(0xFFB91C1C);
  static const Color fondoerror = Color(0xFFFEE2E2);
  static const Color bordeerror = Color(0x47B91C1C);

  static ThemeData get temaclara {
    const scheme = ColorScheme.light(
      primary: marca,
      onPrimary: Colors.white,
      primaryContainer: fondomarca,
      onPrimaryContainer: tinta,
      secondary: secundario,
      onSecondary: Colors.white,
      secondaryContainer: fondosecundario,
      onSecondaryContainer: Color(0xFF431407),
      surface: superficie,
      onSurface: tinta,
      error: error,
      onError: Colors.white,
      errorContainer: fondoerror,
      onErrorContainer: Color(0xFF7F1D1D),
      outline: bordedecontrol,
      outlineVariant: Color(0xFFE2E8F0),
      surfaceTint: Colors.transparent,
    );

    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: scheme,
      fontFamily: 'Manrope',
      scaffoldBackgroundColor: lienzo,
      appBarTheme: const AppBarTheme(
        backgroundColor: superficie,
        foregroundColor: tinta,
        surfaceTintColor: Colors.transparent,
        elevation: 0.5,
        scrolledUnderElevation: 1,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: tinta,
          fontSize: 18,
          fontWeight: FontWeight.w800,
          fontFamily: 'Manrope',
        ),
      ),
      cardTheme: CardThemeData(
        color: superficie,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: marca,
          foregroundColor: Colors.white,
          elevation: 0,
          minimumSize: const Size(48, 48),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontFamily: 'Manrope'),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: marca,
          foregroundColor: Colors.white,
          minimumSize: const Size(48, 48),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
          textStyle: const TextStyle(fontWeight: FontWeight.w700, fontFamily: 'Manrope'),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: tinta,
          minimumSize: const Size(48, 48),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          side: const BorderSide(color: Color(0xFFCBD5E1)),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontFamily: 'Manrope'),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: bordedecontrol),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: bordedecontrol),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: marca, width: 1.8),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: error, width: 1.8),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: superficie,
        surfaceTintColor: Colors.transparent,
        indicatorColor: fondomarca,
        elevation: 2,
        height: 72,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected) ? marca : tintatenue,
          ),
        ),
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            color: states.contains(WidgetState.selected) ? marca : tintatenue,
            fontSize: 12,
            fontWeight: states.contains(WidgetState.selected)
                ? FontWeight.w700
                : FontWeight.w500,
          ),
        ),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: marca,
        linearTrackColor: fondomarca,
      ),
      dividerTheme: const DividerThemeData(
        color: borde,
        thickness: 1,
        space: 1,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: tinta,
        contentTextStyle: const TextStyle(color: Colors.white),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );

    return base.copyWith(
      textTheme: base.textTheme.copyWith(
        headlineSmall: base.textTheme.headlineSmall?.copyWith(
          color: tinta,
          fontSize: 24,
          height: 1.25,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.4,
        ),
        titleLarge: base.textTheme.titleLarge?.copyWith(
          color: tinta,
          fontSize: 19,
          fontWeight: FontWeight.w800,
        ),
        titleMedium: base.textTheme.titleMedium?.copyWith(
          color: tinta,
          fontWeight: FontWeight.w700,
        ),
        bodyLarge: base.textTheme.bodyLarge?.copyWith(
          color: tinta,
          height: 1.45,
        ),
        bodyMedium: base.textTheme.bodyMedium?.copyWith(
          color: tintatenue,
          height: 1.45,
        ),
        labelLarge: base.textTheme.labelLarge?.copyWith(
          color: tinta,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
