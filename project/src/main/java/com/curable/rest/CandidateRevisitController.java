package com.curable.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.curable.domain.CandidateRevisit;
import com.curable.service.CandidateRevisitService;
import com.curable.service.dto.CandidateRevisitDTO;

@RestController
@RequestMapping("/api/candidate-revisit")
public class CandidateRevisitController {

	@Autowired
	private CandidateRevisitService candidateRevisitService;

	/**
	 * Get all candidate revisits
	 */
	@GetMapping
	public List<CandidateRevisitDTO> getAllRevisits() {
		return candidateRevisitService.getAll();
	}

	/**
	 * Get candidate revisit by ID
	 */
	@GetMapping("/{id}")
	public Optional<CandidateRevisitDTO> getRevisitById(@PathVariable Long id) {
		return candidateRevisitService.findById(id);
	}

	/**
	 * Get all revisits for a specific candidate
	 */
	@GetMapping("/candidate/{candidateId}")
	public List<CandidateRevisitDTO> getRevisitsByCandidate(@PathVariable Long candidateId) {
		return candidateRevisitService.findByCandidateId(candidateId);
	}


	/**
	 * Get revisits by status
	 */
	@GetMapping("/status/{status}")
	public List<CandidateRevisitDTO> getRevisitsByStatus(@PathVariable String status) {
		return candidateRevisitService.findByRevisitStatus(status);
	}

	/**
	 * Get revisits by candidate and status
	 */
	@GetMapping("/candidate/{candidateId}/status/{status}")
	public List<CandidateRevisitDTO> getRevisitsByCandidateAndStatus(@PathVariable Long candidateId,
			@PathVariable String status) {
		return candidateRevisitService.findByCandidateAndStatus(candidateId, status);
	}

	/**
	 * Get count of revisits for a candidate
	 */
	@GetMapping("/candidate/{candidateId}/count")
	public long countRevisitsByCandidate(@PathVariable Long candidateId) {
		return candidateRevisitService.countByCandidateId(candidateId);
	}

	/**
	 * Create a new candidate revisit
	 */
	@PostMapping
	public CandidateRevisitDTO createRevisit(@RequestBody CandidateRevisitDTO candidateRevisitDTO) {
		 CandidateRevisit saved = candidateRevisitService.save(candidateRevisitDTO);
		return candidateRevisitDTO;
	}

	/**
	 * Update an existing candidate revisit
	 */
	@PutMapping("/{id}")
	public CandidateRevisitDTO updateRevisit(@PathVariable Long id,
			@RequestBody CandidateRevisitDTO candidateRevisitDTO) throws Exception {
		candidateRevisitDTO.setId(id);
		 CandidateRevisit updated = candidateRevisitService.update(candidateRevisitDTO);
		return candidateRevisitDTO;
	}

	/**
	 * Delete a candidate revisit by ID
	 */
	@DeleteMapping("/{id}")
	public void deleteRevisit(@PathVariable Long id) {
		candidateRevisitService.delete(id);
	}

	/**
	 * Delete all revisits for a candidate
	 */
	@DeleteMapping("/candidate/{candidateId}")
	public void deleteRevisitsByCandidate(@PathVariable Long candidateId) {
		candidateRevisitService.deleteByCandidateId(candidateId);
	}
}
