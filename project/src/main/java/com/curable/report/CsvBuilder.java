package com.curable.report;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.opencsv.CSVWriter;

public class CsvBuilder {
	public static byte[] build(String[] header, List<String[]> rows) {
		if (rows != null && !rows.isEmpty()) {

			try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
					OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
					CSVWriter csvWriter = new CSVWriter(osw)) {

				csvWriter.writeNext(header);
				csvWriter.writeAll(rows);
				csvWriter.flush();
				return baos.toByteArray();

			} catch (Exception e) {
				throw new RuntimeException("CSV generation failed", e);
			}
		}
		return null;
	}
	
	public static byte[] buildConsolidated(List<ReportSection> sections) {

	    try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
	         OutputStreamWriter osw = new OutputStreamWriter(baos, StandardCharsets.UTF_8);
	         CSVWriter csvWriter = new CSVWriter(osw)) {

	        for (ReportSection section : sections) {

	            // Section title
	            csvWriter.writeNext(new String[] { section.getTitle() });

	            // Header
	            csvWriter.writeNext(section.getHeader());

	            // Rows
	            if (section.getRows() != null && !section.getRows().isEmpty()) {
	                csvWriter.writeAll(section.getRows());
	            }

	            // Empty line
	            csvWriter.writeNext(new String[] {});
	        }

	        csvWriter.flush();
	        return baos.toByteArray();

	    } catch (Exception e) {
	        throw new RuntimeException("CSV generation failed", e);
	    }
	}
}
