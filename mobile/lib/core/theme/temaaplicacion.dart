import 'package:flutter/material.dart';

class temaaplicacion {
  static const Color lienzo = Color(0xFFF7F6F1);
  static const Color superficie = Color(0xFFFFFFFF);
  static const Color tinta = Color(0xFF292820);
  static const Color tintatenue = Color(0xFF706E64);
  static const Color borde = Color(0xFFE7E4DA);
  static const Color bordedecontrol = Color(0xFF8E8B80);
  static const Color marca = Color(0xFF806719);
  static const Color fondomarca = Color(0xFFF4EBCB);
  static const Color exito = Color(0xFF496B4A);
  static const Color fondoexito = Color(0xFFEDF3EC);
  static const Color advertencia = Color(0xFF8A6615);
  static const Color fondoadvertencia = Color(0xFFFBF3DB);
  static const Color bordeadvertencia = Color(0x338A6615);
  static const Color error = Color(0xFF9B4038);
  static const Color fondoerror = Color(0xFFF8ECEA);
  static const Color bordeerror = Color(0x479B4038);

  static ThemeData get temaclara {
    const scheme = ColorScheme.light(
      primary: marca,
      onPrimary: Colors.white,
      primaryContainer: fondomarca,
      onPrimaryContainer: tinta,
      secondary: Color(0xFF626B56),
      onSecondary: Colors.white,
      secondaryContainer: Color(0xFFEAEEE5),
      onSecondaryContainer: Color(0xFF293126),
      surface: superficie,
      onSurface: tinta,
      error: error,
      onError: Colors.white,
      errorContainer: fondoerror,
      onErrorContainer: Color(0xFF57211C),
      outline: bordedecontrol,
      outlineVariant: Color(0xFFD5D1C6),
      surfaceTint: Colors.transparent,
    );

    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: scheme,
      fontFamily: 'Manrope',
      scaffoldBackgroundColor: lienzo,
      appBarTheme: const AppBarTheme(
        backgroundColor: lienzo,
        foregroundColor: tinta,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: tinta,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
      ),
      cardTheme: CardThemeData(
        color: superficie,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: bordedecontrol),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: marca,
          foregroundColor: Colors.white,
          elevation: 0,
          minimumSize: const Size(48, 48),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: marca,
          foregroundColor: Colors.white,
          minimumSize: const Size(48, 48),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: tinta,
          minimumSize: const Size(48, 48),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          side: const BorderSide(color: borde),
          textStyle: const TextStyle(fontWeight: FontWeight.w600),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFFCFBF8),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 16,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: bordedecontrol),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: bordedecontrol),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: marca, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: error, width: 1.5),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: superficie,
        surfaceTintColor: Colors.transparent,
        indicatorColor: fondomarca,
        elevation: 0,
        height: 72,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        iconTheme: WidgetStateProperty.resolveWith(
          (states) => IconThemeData(
            color: states.contains(WidgetState.selected) ? marca : tintatenue,
          ),
        ),
        labelTextStyle: WidgetStateProperty.resolveWith(
          (states) => TextStyle(
            color: states.contains(WidgetState.selected) ? tinta : tintatenue,
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    );

    return base.copyWith(
      textTheme: base.textTheme.copyWith(
        headlineSmall: base.textTheme.headlineSmall?.copyWith(
          color: tinta,
          fontSize: 26,
          height: 1.2,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.5,
        ),
        titleLarge: base.textTheme.titleLarge?.copyWith(
          color: tinta,
          fontSize: 20,
          fontWeight: FontWeight.w700,
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
