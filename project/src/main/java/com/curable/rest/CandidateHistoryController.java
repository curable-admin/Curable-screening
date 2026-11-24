package com.curable.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.curable.service.CandidateHistoryService;
import com.curable.service.dto.CandidateHistoryDTO;
import com.curable.service.dto.custom.CandidateSearchCustomDTO;
import com.curable.service.dto.custom.HistoryResponseDTO;

@RestController
public class CandidateHistoryController {

	@Autowired
	private CandidateHistoryService service;

	// RESTful API methods for Retrieval operation
	@GetMapping("/candidatehistory")
	public List<CandidateHistoryDTO> getAllCandidateHistorys() {
		// log.debug("REST request to get all CandidateHistory");
		return service.getAll();
	}

	@GetMapping("/candidatehistory/{id}")
	public Optional<CandidateHistoryDTO> getCandidateHistory(@PathVariable Long id) {
		// log.debug("REST request to get CandidateHistorys : {}", id);
		return service.findBy(id);
	}

	@PostMapping("/candidatehistory")
	public CandidateHistoryDTO postCandidateHistory(@RequestBody CandidateHistoryDTO candidatehistory) {
		// log.debug("REST request to save candidatehistory : {}", id);
		return service.save(candidatehistory);

	}

	@PostMapping("/candidatehistoryUpdates")
	public boolean candidatehistoryUpdates(@RequestBody CandidateHistoryDTO candidatehistory) {
		// log.debug("REST request to save candidatehistory : {}", id);
		return service.updateScreeningOrClinicalData(candidatehistory);

	}

	@GetMapping("/candidatehistory/candidate/{id}")
	public List<CandidateHistoryDTO> getCandidateHistoryCandidate(@PathVariable Long id) {
		// log.debug("REST request to get CandidateHistorys : {}", id);
		return service.findByCandidate_IdAndIsRecordDeletedFalse(id);
	}

	@GetMapping("/candidateCustomHistory/{candidateId}")
	public HistoryResponseDTO getHistoryByCandidateId(@PathVariable Long candidateId) {
		// log.debug("REST request to get candidate history : {}", candidateId);
		return service.getHistoryByCandidateId(candidateId);
	}

	@PostMapping("/candidatehistoryForPrefil")
	public ResponseEntity<?> getCandidateDetails(@RequestBody CandidateSearchCustomDTO candidateSearchCustomDTO) {
		// log.debug("REST request to get CandidateHistorys : {}", id);
		return service.getCandidateDetails(candidateSearchCustomDTO);
	}

}
